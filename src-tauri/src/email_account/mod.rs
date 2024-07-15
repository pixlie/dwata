use crate::email::Email;
use crate::error::DwataError;
use crate::oauth2::OAuth2;
use crate::workspace::{
    crud::CRUDRead,
    typesense::{TypesenseCollection, TypesenseField, TypesenseSearchable},
};
use chrono::{DateTime, TimeDelta, Utc};
use imap::{self, Session};
use log::{error, info};
use native_tls::TlsStream;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqliteConnection, Type};
use std::{
    fs::{create_dir_all, read_dir, File},
    io::Read,
    net::TcpStream,
    path::{Path, PathBuf},
};
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod api;
pub mod commands;
pub mod crud;

#[derive(Deserialize, Serialize, Type, TS, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
#[ts(export)]
pub enum EmailProvider {
    Gmail,
    ProtonMail,
    // Yahoo,
    // Outlook,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailAccount {
    #[ts(type = "number")]
    pub id: i64,

    pub provider: EmailProvider,

    pub email_address: String,
    pub password: Option<String>,
    pub oauth2_id: Option<i64>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,

    // IMAP protocol and local storage related
    #[serde(skip)]
    #[ts(skip)]
    #[sqlx(skip)]
    pub mailbox: Option<String>,
    #[serde(skip)]
    #[ts(skip)]
    #[sqlx(skip)]
    pub storage_dir: Option<PathBuf>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailAccountCreateUpdate {
    pub provider: Option<String>,
    pub email_address: Option<String>,
    pub password: Option<String>,
    pub oauth2_id: Option<String>,
}

pub struct GmailAccount {
    email_address: String,
    access_token: String,
}

impl imap::Authenticator for GmailAccount {
    type Response = String;
    fn process(&self, _: &[u8]) -> Self::Response {
        format!(
            "user={}\x01auth=Bearer {}\x01\x01",
            self.email_address, self.access_token
        )
    }
}

impl EmailAccount {
    pub async fn fetch_emails(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<(), DwataError> {
        // We read emails using IMAP and store the raw messages in a local folder
        let mut imap_session = self.get_imap_session(db_connection).await?;
        match imap_session.examine(self.mailbox.as_ref().unwrap()) {
            Ok(mailbox) => info!("{}", mailbox),
            Err(e) => error!("Error selecting INBOX: {}", e),
        };

        let since = Utc::now() - TimeDelta::weeks(1);
        let email_uid_list = imap_session
            .uid_search(format!("SINCE {}", since.format("%d-%b-%Y").to_string()))
            .unwrap();
        info!(
            "Searching for emails since {}, found {} emails",
            since.format("%d-%b-%Y"),
            email_uid_list.len()
        );
        let mut storage_dir = self.storage_dir.as_ref().unwrap().clone();
        storage_dir.push("emails");
        storage_dir.push(self.email_address.clone());
        storage_dir.push("INBOX");
        if let Ok(false) = Path::try_exists(storage_dir.as_path()) {
            match create_dir_all(storage_dir.as_path()) {
                Ok(_) => {}
                Err(err) => {
                    error!("Could not create local folder\n Error: {}", err);
                    return Err(DwataError::CouldNotCreateLocalEmailStorage);
                }
            }
        }

        match imap_session.uid_fetch(
            email_uid_list
                .iter()
                .map(|x| format!("{}", x))
                .collect::<Vec<String>>()
                .join(","),
            "(BODY.PEEK[] UID)",
        ) {
            Ok(messages) => {
                for message in messages.iter() {
                    match message.body() {
                        Some(body) => {
                            // Store the email in a local folder
                            let mut file_path = storage_dir.clone();
                            file_path.push(format!("{}.email", message.uid.unwrap()));
                            info!("File path: {}", file_path.to_str().unwrap());
                            std::fs::write(file_path, body).unwrap();
                        }
                        None => continue,
                    }
                }
            }
            Err(e) => error!("Error Fetching email 1: {}", e),
        };

        imap_session.logout().unwrap();
        Ok(())
    }

    pub async fn process_stored_emails(&self) -> Result<Vec<String>, DwataError> {
        // We parse the files that are in the given email storage directory
        // and extract our JSON structure.

        // We read emails from the local folder and parse them to extract the Email struct
        let mut emails: Vec<Email> = vec![];
        let storage_dir = self.storage_dir.as_ref().unwrap();
        info!(
            "Reading emails from local storage directory: {}",
            &storage_dir.to_str().unwrap()
        );
        if !std::path::Path::exists(&storage_dir) {
            error!(
                "Could not find email storage directory: {}",
                &storage_dir.to_str().unwrap()
            );
            return Err(DwataError::CouldNotOpenLocalEmailStorage);
        }
        // Read all email files in the local folder
        match read_dir(&storage_dir) {
            Ok(entries) => {
                for entry in entries {
                    let entry = match entry {
                        Ok(x) => x,
                        Err(err) => {
                            error!("Could not get email file entry.\n Error: {}", err);
                            continue;
                        }
                    };
                    let path = entry.path();
                    if path.is_file() {
                        // We read the file contents and parse it to extract the email
                        let mut file = match File::open(&path) {
                            Ok(x) => x,
                            Err(err) => {
                                error!(
                                    "Could not open email file {}\n Error: {}",
                                    path.to_str().unwrap(),
                                    err
                                );
                                continue;
                            }
                        };
                        let mut file_contents: Vec<u8> = Vec::new();
                        match file.read_to_end(&mut file_contents) {
                            Ok(_) => {}
                            Err(err) => {
                                error!(
                                    "Could not read email file {}\n Error: {}",
                                    path.to_str().unwrap(),
                                    err
                                );
                                continue;
                            }
                        };
                        // Extract the email UID from the file name, which has .email at the end
                        match Email::parse_email_from_file(
                            path.file_name()
                                .unwrap()
                                .to_string_lossy()
                                .split(".")
                                .collect::<Vec<&str>>()
                                .iter()
                                .nth(0)
                                .unwrap()
                                .to_string(),
                            file_contents,
                        )
                        .await
                        {
                            Ok(email) => {
                                emails.push(email);
                            }
                            Err(err) => {
                                error!("Could not parse email file\n Error: {}", err);
                                continue;
                            }
                        }
                    }
                }
            }
            Err(err) => {
                error!(
                    "Could not read email storage directory {}\n Error: {}",
                    &storage_dir.to_string_lossy(),
                    err
                )
            }
        }

        info!("Emails to index in Typesense: {}", emails.len());
        Ok(emails
            .iter()
            .map(|x| serde_json::to_string(&x).unwrap())
            .collect::<Vec<String>>())
    }
}

impl EmailAccount {
    pub async fn get_imap_session(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<Session<TlsStream<TcpStream>>, DwataError> {
        match self.provider {
            EmailProvider::Gmail => {
                let gmail_account = self.get_gmail_account(db_connection).await?;
                let domain = "imap.gmail.com";
                let tls = native_tls::TlsConnector::builder().build().unwrap();
                let client = imap::connect((domain, 993), domain, &tls).unwrap();

                match client.authenticate("XOAUTH2", &gmail_account) {
                    Ok(session) => {
                        info!("Logged into Gmail with Oauth2 credentials");
                        Ok(session)
                    }
                    Err((error, _unauth_client)) => {
                        error!("Error authenticating with Gmail:\n{}", error);
                        return Err(DwataError::CouldNotAuthenticateToService);
                    }
                }
            }
            EmailProvider::ProtonMail => {
                let domain = "localhost";
                let tls = native_tls::TlsConnector::builder().build().unwrap();
                let client = imap::connect_starttls((domain, 1143), domain, &tls).unwrap();

                match client.login(&self.email_address, &self.password.as_ref().unwrap()) {
                    Ok(session) => {
                        info!("Logged into Protonmail with Oauth2 credentials");
                        Ok(session)
                    }
                    Err((error, _unauth_client)) => {
                        error!("Error authenticating with Protonmail:\n{}", error);
                        return Err(DwataError::CouldNotAuthenticateToService);
                    }
                }
            }
        }
    }
}

impl EmailAccount {
    pub async fn get_gmail_account(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<GmailAccount, DwataError> {
        if let Some(oauth2_config_id) = self.oauth2_id {
            let oauth2: OAuth2 = OAuth2::read_one_by_pk(oauth2_config_id, db_connection).await?;
            let gmail_account = GmailAccount {
                email_address: self.email_address.clone(),
                access_token: oauth2.access_token,
            };
            Ok(gmail_account)
        } else {
            Err(DwataError::CouldNotFindOAuth2Config)
        }
    }
}

impl TypesenseSearchable for EmailAccount {
    async fn get_collection_name(&self) -> String {
        format!(
            "dwata_emails_{}_{}",
            self.id,
            self.mailbox.as_ref().unwrap()
        )
    }

    async fn get_collection_schema(&self) -> Result<TypesenseCollection, DwataError> {
        Ok(TypesenseCollection {
            name: self.get_collection_name().await,
            fields: Email::get_typesense_fields(),
            default_sorting_field: Some("date".to_string()),
        })
    }

    async fn get_json_lines(&self) -> Result<Vec<String>, DwataError> {
        self.process_stored_emails().await
    }
}

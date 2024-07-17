use crate::email::Email;
use crate::error::DwataError;
use crate::oauth2::OAuth2;
use crate::workspace::DwataDb;
use crate::workspace::{
    crud::CRUDRead,
    typesense::{TypesenseCollection, TypesenseSearchable},
};
use app_state::EmailAccountsState;
use chrono::{DateTime, NaiveDate, TimeDelta, Utc};
use helpers::{fetch_email_uid_list, fetch_emails};
use imap::types::Mailbox;
use imap::{self, Session};
use log::{error, info};
use native_tls::TlsStream;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqliteConnection, Type};
use std::collections::HashSet;
use std::sync::Arc;
use std::{
    fs::{create_dir_all, read_dir, File},
    io::Read,
    net::TcpStream,
    path::{Path, PathBuf},
};
use strum::{Display, EnumString};
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;
use tokio::task::JoinSet;
use ts_rs::TS;

pub mod api;
pub mod app_state;
pub mod commands;
pub mod crud;
pub mod helpers;

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

pub struct EmailAccountItemStatus {
    pub id: i64,
    // MESSAGES: The number of messages in the mailbox.
    pub messages: u32,
    // RECENT: The number of messages with Flag::Recent set.
    pub recent: u32,
    // UIDNEXT: The next Uid of the mailbox.
    pub uid_next: Option<u32>,
    // UIDVALIDITY: The unique identifier validity value of the mailbox (see Uid).
    pub uid_validity: Option<u32>,
    // UNSEEN: The number of messages which do not have Flag::Seen set.
    pub unseen: Option<u32>,
    // Related to IMAP processing in dwata
    pub last_fetched_at: i64,
    pub fetched_till_date: Option<NaiveDate>,
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
    pub fn prep_for_access(&mut self, storage_dir: PathBuf) {
        let mut storage_dir = storage_dir.clone();
        storage_dir.push("emails");
        storage_dir.push(self.email_address.clone());
        storage_dir.push("INBOX");
        self.mailbox = Some("INBOX".to_string());
        self.storage_dir = Some(storage_dir);
    }

    pub async fn update_status(&self, app: AppHandle, mailbox: Mailbox) {
        let email_accounts_state = app.state::<EmailAccountsState>();
        let mut email_accounts_state_guard = email_accounts_state.lock().await;
        let mut found = false;
        // Check if we already have this email account in our state
        for email_account_item_status in email_accounts_state_guard.iter_mut() {
            if email_account_item_status.id == self.id {
                email_account_item_status.messages = mailbox.exists;
                email_account_item_status.recent = mailbox.recent;
                email_account_item_status.uid_next = mailbox.uid_next;
                email_account_item_status.uid_validity = mailbox.uid_validity;
                email_account_item_status.unseen = mailbox.unseen;
                email_account_item_status.last_fetched_at = Utc::now().timestamp();
                found = true;
                break;
            }
        }
        if !found {
            // If we don't have this email account in our state, then we add it
            email_accounts_state_guard.push(EmailAccountItemStatus {
                id: self.id,
                messages: mailbox.exists,
                recent: mailbox.recent,
                uid_next: mailbox.uid_next,
                uid_validity: mailbox.uid_validity,
                unseen: mailbox.unseen,
                last_fetched_at: Utc::now().timestamp(),
                fetched_till_date: None,
            });
        }
    }

    pub async fn fetch_emails(&self, app: AppHandle) -> Result<(), DwataError> {
        // We read emails using IMAP and store the raw messages in a local folder
        let db = app.state::<DwataDb>();
        let mut imap_session = {
            let mut db_guard = db.lock().await;
            self.get_imap_session(&mut db_guard).await?
        };
        match imap_session.examine(self.mailbox.as_ref().unwrap()) {
            Ok(mailbox) => {
                info!("Selected mailbox: {}", mailbox);
                self.update_status(app.clone(), mailbox).await;
            }
            Err(e) => error!("Error selecting INBOX: {}", e),
        };

        let storage_dir = self.storage_dir.as_ref().unwrap().clone();
        if let Ok(false) = Path::try_exists(storage_dir.as_path()) {
            match create_dir_all(storage_dir.as_path()) {
                Ok(_) => {}
                Err(err) => {
                    error!("Could not create local folder\n Error: {}", err);
                    return Err(DwataError::CouldNotCreateLocalEmailStorage);
                }
            }
        }

        let shared_email_uid_list = Arc::new(Mutex::new(HashSet::<u32>::new()));
        let shared_imap_session = Arc::new(Mutex::new(imap_session));
        let shared_fetched_email_uid_count = Arc::new(Mutex::new(0));
        let email_accounts_state = app.state::<EmailAccountsState>();
        let email_accounts_state_guard = email_accounts_state.lock().await;
        let email_account_status = email_accounts_state_guard
            .iter()
            .find(|x| x.id == self.id)
            .unwrap();
        let fetch_batch_limit = 25;
        let mut month = 0;
        let mut fetch_email_uid_set = JoinSet::new();
        let mut fetch_email_set = JoinSet::new();
        let mut before = Utc::now().date_naive();
        loop {
            month += 1;
            let moved_imap_session = shared_imap_session.clone();
            let moved_email_uid_list = shared_email_uid_list.clone();
            let since = before - TimeDelta::weeks(4);
            fetch_email_uid_set.spawn(async move {
                fetch_email_uid_list(
                    moved_email_uid_list,
                    moved_imap_session,
                    since.format("%d-%b-%Y").to_string(),
                    before.format("%d-%b-%Y").to_string(),
                )
                .await;
            });
            before = since;
            {
                let email_uid_list = shared_email_uid_list.lock().await;
                let mut fetched_email_uid_count = shared_fetched_email_uid_count.lock().await;
                let moved_imap_session = shared_imap_session.clone();
                let moved_storage_dir = storage_dir.clone();
                // We select the next batch of email Uids to fetch
                let mut next_email_uid_list: Vec<u32> = vec![];
                for uid in email_uid_list
                    .iter()
                    .skip(*fetched_email_uid_count)
                    .take(fetch_batch_limit)
                {
                    next_email_uid_list.push(*uid);
                }
                if next_email_uid_list.len() > 0 {
                    *fetched_email_uid_count += next_email_uid_list.len();
                    fetch_email_set.spawn(async move {
                        fetch_emails(next_email_uid_list, moved_imap_session, moved_storage_dir)
                            .await;
                    });
                }
            }

            // Let's check if we have already received the entire list of email Uids
            let email_uid_list = shared_email_uid_list.lock().await;
            if email_uid_list.len() >= email_account_status.messages.try_into().unwrap()
                || month >= 18
            {
                while let Some(_) = fetch_email_uid_set.join_next().await {}
                info!("Finished all tasks to fetch email uids");
                while let Some(_) = fetch_email_set.join_next().await {}
                info!("Finished all tasks to fetch emails");
                break;
            }
        }

        let mut imap_session = shared_imap_session.lock().await;
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
                            path.file_name().unwrap().to_string_lossy().to_string(),
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

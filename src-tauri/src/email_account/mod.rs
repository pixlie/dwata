use crate::email::{Email, EmailBucket, SearchableEmail};
use crate::error::DwataError;
use crate::oauth2::OAuth2;
use crate::workspace::DwataDb;
use crate::workspace::{
    crud::CRUDRead,
    typesense::{TypesenseCollection, TypesenseSearchable},
};
use app_state::EmailAccountsState;
use chrono::{DateTime, NaiveDate, TimeDelta, Utc};
use helpers::{fetch_email_uid_list, fetch_emails, read_emails_from_local_storage};
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

#[derive(Default)]
pub struct EmailAccountIMAPStatus {
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
    pub last_fetched_at: Option<i64>,
    // Which date range is being searched
    pub searching_date_range: Option<(NaiveDate, NaiveDate)>,
}

pub struct EmailAccountStatus {
    // IMAP protocol and local storage related
    pub selected_mailbox: String,
    pub storage_dir: PathBuf,
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

    #[serde(skip)]
    #[sqlx(skip)]
    #[ts(skip)]
    pub status: Option<EmailAccountStatus>,

    #[serde(skip)]
    #[sqlx(skip)]
    #[ts(skip)]
    pub imap_status: Option<EmailAccountIMAPStatus>,
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
    pub fn get_storage_dir(&self) -> PathBuf {
        self.status.as_ref().unwrap().storage_dir.clone()
    }

    pub fn get_selected_mailbox(&self) -> String {
        self.status.as_ref().unwrap().selected_mailbox.clone()
    }

    pub async fn prep_for_access(
        &mut self,
        mailbox_name: String,
        storage_dir: PathBuf,
        needs_imap_status: bool,
        app: AppHandle,
    ) -> Result<(), DwataError> {
        let db = app.state::<DwataDb>();

        // Set the path to local storage for emails
        let mut storage_dir = storage_dir.clone();
        storage_dir.push("emails");
        storage_dir.push(self.email_address.clone());
        storage_dir.push(&mailbox_name);

        self.status = Some(EmailAccountStatus {
            selected_mailbox: mailbox_name.clone(),
            storage_dir,
        });

        if needs_imap_status {
            let mut imap_session = {
                let mut db_guard = db.lock().await;
                self.get_imap_session(&mut db_guard).await?
            };
            match imap_session.examine(&mailbox_name) {
                Ok(mailbox) => {
                    info!("Selected mailbox: {}", mailbox);
                    // self.update_status(app.clone(), mailbox).await;
                    self.imap_status = Some(EmailAccountIMAPStatus {
                        id: self.id,
                        messages: mailbox.exists,
                        recent: mailbox.recent,
                        uid_next: mailbox.uid_next,
                        uid_validity: mailbox.uid_validity,
                        unseen: mailbox.unseen,
                        last_fetched_at: Some(Utc::now().timestamp()),
                        ..Default::default()
                    });
                }
                Err(e) => {
                    error!("Error selecting INBOX: {}", e);
                    return Err(DwataError::CouldNotSelectMailbox);
                }
            };
        }

        Ok(())
    }

    // pub async fn update_status(&self, app: AppHandle, mailbox: Mailbox) {
    //     let email_accounts_state = app.state::<EmailAccountsState>();
    //     let mut email_accounts_state_guard = email_accounts_state.lock().await;
    //     let mut found = false;
    //     // Check if we already have this email account in our state
    //     for email_account_item_status in email_accounts_state_guard.iter_mut() {
    //         if email_account_item_status.id == self.id {
    //             email_account_item_status.messages = mailbox.exists;
    //             email_account_item_status.recent = mailbox.recent;
    //             email_account_item_status.uid_next = mailbox.uid_next;
    //             email_account_item_status.uid_validity = mailbox.uid_validity;
    //             email_account_item_status.unseen = mailbox.unseen;
    //             email_account_item_status.last_fetched_at = Utc::now().timestamp();
    //             found = true;
    //             break;
    //         }
    //     }
    //     if !found {
    //         // If we don't have this email account in our state, then we add it
    //         email_accounts_state_guard.push(EmailAccountStatus {
    //             id: self.id,
    //             messages: mailbox.exists,
    //             recent: mailbox.recent,
    //             uid_next: mailbox.uid_next,
    //             uid_validity: mailbox.uid_validity,
    //             unseen: mailbox.unseen,
    //             last_fetched_at: Utc::now().timestamp(),
    //             fetched_till_date: None,
    //         });
    //     }
    // }

    pub async fn fetch_emails(&self, app: AppHandle) -> Result<(), DwataError> {
        let db = app.state::<DwataDb>();
        let imap_session = {
            let mut db_guard = db.lock().await;
            self.get_imap_session(&mut db_guard).await?
        };

        // We read emails using IMAP and store the raw messages in a local folder
        let storage_dir = self.get_storage_dir();
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
        let email_accounts_state = app.state::<EmailAccountsState>();
        let email_accounts_state_guard = email_accounts_state.lock().await;
        let email_account_status = email_accounts_state_guard
            .iter()
            .find(|x| x.id == self.id)
            .unwrap();
        let fetch_batch_limit = 25;
        let mut month = 0;
        let mut fetch_email_uid_set = JoinSet::new();
        let mut before = Utc::now().date_naive();
        // Let's retrieve all the email Uids in the last 300 months (25 years)
        while month < 300 {
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
            let email_uid_list = shared_email_uid_list.lock().await;
            if email_uid_list.len() >= email_account_status.messages.try_into().unwrap() {
                break;
            }
        }
        if fetch_email_uid_set.len() > 0 {
            while let Some(_) = fetch_email_uid_set.join_next().await {}
        }
        info!("Finished all tasks to fetch email uids");

        // Let's fetch the actual emails, in batches
        let email_uid_list = shared_email_uid_list.lock().await;
        let mut fetch_email_set = JoinSet::new();
        let mut fetched_email_count = 0;
        while fetched_email_count < email_uid_list.len() {
            let moved_imap_session = shared_imap_session.clone();
            let moved_storage_dir = storage_dir.clone();
            // We select the next batch of email Uids to fetch
            let mut batch: Vec<u32> = vec![];
            for uid in email_uid_list
                .iter()
                .skip(fetched_email_count)
                .take(fetch_batch_limit)
            {
                batch.push(*uid);
            }
            if batch.len() > 0 {
                fetched_email_count += batch.len();
                fetch_email_set.spawn(async move {
                    fetch_emails(batch, moved_imap_session, moved_storage_dir).await;
                });
            }
        }
        if fetch_email_set.len() > 0 {
            while let Some(_) = fetch_email_set.join_next().await {}
        }
        info!("Finished all tasks to fetch emails");

        let mut imap_session = shared_imap_session.lock().await;
        imap_session.logout().unwrap();
        Ok(())
    }

    pub async fn store_emails_in_db(&self) -> Result<usize, DwataError> {
        // Let's save the emails into Dwata DB, in batches of 100 at a time
        let emails = read_emails_from_local_storage(self.get_storage_dir(), 1000).await?;
        let mut buckets: Vec<EmailBucket> = vec![];

        for email in &emails {
            if let Some(in_reply_to) = email.in_reply_to.as_ref() {
                // This email is a reply to another email, let's find the root email
                if let Some(root_email) = &emails
                    .iter()
                    .filter(|item| item.message_id.is_some())
                    .find(|x| *x.message_id.as_ref().unwrap() == *in_reply_to)
                {
                    // We found the root email, let's find the bucket
                    if let Some(bucket) = buckets
                        .iter_mut()
                        .find(|x| x.root_email_id == Some(root_email.id))
                    {
                        // We found the bucket, let's add this email to it
                        bucket.id_list_raw.push(email.id);
                    } else {
                        // We did not find the bucket, let's create a new one
                        buckets.push(EmailBucket {
                            root_email_id: Some(root_email.id),
                            id_list_raw: vec![email.id],
                            ..Default::default()
                        });
                    }
                }
            };
        }
        info!("Found {} buckets", buckets.len());
        Ok(1000)
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
        format!("dwata_emails_{}_{}", self.id, self.get_selected_mailbox())
    }

    async fn get_collection_schema(&self) -> Result<TypesenseCollection, DwataError> {
        Ok(TypesenseCollection {
            name: self.get_collection_name().await,
            fields: Email::get_typesense_fields(),
            default_sorting_field: Some("date".to_string()),
        })
    }

    async fn get_json_lines(&self) -> Result<Vec<String>, DwataError> {
        let emails = read_emails_from_local_storage(self.get_storage_dir(), 1000).await?;

        info!("Emails to index in Typesense: {}", emails.len());
        Ok(emails
            .iter()
            .map(|x| {
                serde_json::to_string(&SearchableEmail {
                    id: x.id.to_string(),
                    from_name: x.from_name.clone(),
                    from_email: x.from_email.clone(),
                    date: x.date,
                    subject: x.subject.clone(),
                    body_text: x.body_text.clone(),
                })
                .unwrap()
            })
            .collect::<Vec<String>>())
    }
}

use crate::email::EmailBucket;
use crate::error::DwataError;
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead};
use crate::workspace::DwataDb;
use chrono::{DateTime, NaiveDate, TimeDelta, Utc};
use helpers::{fetch_email_uid_list, fetch_emails, read_emails_from_local_storage};
use imap::Session;
use log::{error, info};
use native_tls::TlsStream;
use serde::{Deserialize, Serialize};
use slug::slugify;
use sqlx::{FromRow, Type};
use std::collections::{HashMap, HashSet};
use std::net::TcpStream;
use std::sync::Arc;
use std::{
    fs::create_dir_all,
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
pub mod providers;
pub mod typesense;

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
}

#[derive(Default)]
pub struct EmailAccountStatus {
    // IMAP protocol and local storage related
    pub selected_mailbox_choice: MailboxChoice,
    pub storage_dir: PathBuf,
    // Related to IMAP processing in dwata
    pub last_fetched_at: Option<i64>,
    // Which date range is being searched
    pub searching_date_range: Option<(NaiveDate, NaiveDate)>,
    // Information about logged in IMAP session
    pub imap_status: Option<EmailAccountIMAPStatus>,

    pub imap_session: Option<Arc<Mutex<Session<TlsStream<TcpStream>>>>>,
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

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Mailbox {
    #[ts(type = "number")]
    pub id: i64,
    pub email_account_id: i64,
    pub name: String,
    #[ts(skip)]
    pub storage_path: String,
}

pub struct MailboxCreateUpdate {
    pub email_account_id: Option<i64>,
    pub name: Option<String>,
    pub storage_path: Option<String>,
}

#[derive(Default)]
pub enum MailboxChoice {
    #[default]
    Inbox,
    Sent,
}

impl EmailAccount {
    pub async fn get_storage_dir(&self, app: AppHandle) -> Result<PathBuf, DwataError> {
        Ok(self.status.as_ref().unwrap().storage_dir.join(slugify(
            self.get_selected_mailbox(app).await?.storage_path.clone(),
        )))
    }

    pub async fn prep_for_access(
        &mut self,
        mailbox_choice: MailboxChoice,
        storage_dir: PathBuf,
        needs_imap_session: bool,
        app: AppHandle,
    ) -> Result<(), DwataError> {
        // Set the path to local storage for emails
        let mut storage_dir = storage_dir.clone();
        storage_dir.push("emails");
        storage_dir.push(self.email_address.clone());

        self.status = Some(EmailAccountStatus {
            selected_mailbox_choice: mailbox_choice,
            storage_dir,
            last_fetched_at: Some(Utc::now().timestamp()),
            ..Default::default()
        });

        if needs_imap_session {
            self.sync_mailboxes(app.clone()).await?;
            let imap_session = self.get_imap_session(app.clone()).await?;
            let mut imap_session = imap_session.lock().await;
            let email_account_mailbox = self.get_selected_mailbox(app.clone()).await?;
            match imap_session.examine(&email_account_mailbox.name) {
                Ok(mailbox) => {
                    info!("Selected mailbox: {}", mailbox);
                    self.status.as_mut().unwrap().imap_status = Some(EmailAccountIMAPStatus {
                        id: self.id,
                        messages: mailbox.exists,
                        recent: mailbox.recent,
                        uid_next: mailbox.uid_next,
                        uid_validity: mailbox.uid_validity,
                        unseen: mailbox.unseen,
                        ..Default::default()
                    });
                }
                Err(err) => {
                    error!(
                        "Error selecting mailbox {}: {} - {}",
                        email_account_mailbox.id, email_account_mailbox.name, err
                    );
                    return Err(DwataError::CouldNotSelectMailbox);
                }
            };
        }

        Ok(())
    }

    pub async fn sync_mailboxes(&mut self, app: AppHandle) -> Result<(), DwataError> {
        // Store all the mailboxes in Dwata DB
        let imap_session = self.get_imap_session(app.clone()).await.unwrap();
        let mut imap_session = imap_session.lock().await;
        let db = app.state::<DwataDb>();
        let mailboxes_in_db = {
            let mut db_guard = db.lock().await;
            Mailbox::read_all(&mut db_guard).await?
        };
        for mailbox in imap_session.list(None, Some("*")).unwrap().iter() {
            let mailbox_name = mailbox.name().trim().to_string();
            if mailboxes_in_db.len() == 0
                || mailboxes_in_db
                    .iter()
                    .find(|mb| mb.email_account_id == self.id && mb.name == mailbox_name)
                    .is_none()
            {
                // We did not find this mailbox in Dwata DB, let's add it
                info!("Saving mailbox: {}", mailbox.name());
                let mut db_guard = db.lock().await;
                MailboxCreateUpdate {
                    email_account_id: Some(self.id),
                    name: Some(mailbox_name.clone()),
                    storage_path: Some(slugify(mailbox_name)),
                }
                .insert_module_data(&mut db_guard)
                .await?;
            }
        }
        Ok(())
    }

    pub async fn fetch_emails(&mut self, app: AppHandle) -> Result<(), DwataError> {
        // We read emails using IMAP and store the raw messages in a local folder
        let storage_dir = self.get_storage_dir(app.clone()).await?;
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
        let number_of_messages = self
            .status
            .as_ref()
            .unwrap()
            .imap_status
            .as_ref()
            .unwrap()
            .messages;
        let fetch_batch_limit = 25;
        let mut month = 0;
        let mut before = Utc::now().date_naive();
        // Let's retrieve all the email Uids in the last 300 months (25 years)
        while month < 300 {
            month += 1;
            let moved_imap_session = self.get_imap_session(app.clone()).await?;
            let moved_email_uid_list = shared_email_uid_list.clone();
            let since = before - TimeDelta::weeks(4);
            fetch_email_uid_list(
                moved_email_uid_list,
                moved_imap_session,
                number_of_messages,
                since.format("%d-%b-%Y").to_string(),
                before.format("%d-%b-%Y").to_string(),
            )
            .await;
            before = since;
        }
        info!("Finished all tasks to fetch email uids");

        // Let's fetch the actual emails, in batches
        let email_uid_list = shared_email_uid_list.lock().await;
        let mut fetch_email_set = JoinSet::new();
        let mut fetched_email_count = 0;
        while fetched_email_count < email_uid_list.len() {
            let moved_imap_session = self.get_imap_session(app.clone()).await?;
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

        let imap_session = self.get_imap_session(app.clone()).await?;
        let mut imap_session = imap_session.lock().await;
        match imap_session.logout() {
            Ok(_) => {}
            Err(err) => {
                error!("Could not logout IMAP session: {}", err);
            }
        }
        Ok(())
    }

    pub async fn store_emails_in_db(&self, app: AppHandle) -> Result<usize, DwataError> {
        // Let's save the emails into Dwata DB, in batches of 100 at a time
        let emails = read_emails_from_local_storage(self.get_storage_dir(app).await?, 1000).await?;
        let mut buckets: Vec<EmailBucket> = vec![];

        for email in emails
            .iter()
            .filter(|x| x.subject.contains("On Deck Early Stage Mastermind"))
        {
            // We are checking if this email is a reply to another email
            // We need to do this recursively, so we keep checking the parent email until we find the root email
            // which does not have an `in_reply_to` field
            info!("Email: {}: {}", email.id, email.subject);
            let mut root_email = email;
            let mut found_in_reply_to = false;
            while let Some(in_reply_to) = root_email.in_reply_to.as_ref() {
                found_in_reply_to = true;
                root_email = match emails
                    .iter()
                    .filter(|item| item.message_id.as_ref().is_some_and(|x| x == in_reply_to))
                    .nth(0)
                {
                    Some(x) => x,
                    None => break,
                };
            }
            info!(
                "Found root email: {}: {} - {}",
                root_email.id,
                root_email
                    .in_reply_to
                    .as_ref()
                    .unwrap_or(&"None".to_string()),
                root_email.subject
            );

            if found_in_reply_to {
                // This email is a reply to another email, let's find the root email recursively
                // Let's find the bucket for this email
                if let Some(bucket) = buckets
                    .iter_mut()
                    .find(|x| x.root_email_id == Some(root_email.id))
                {
                    // We found the bucket, let's add this email to it
                    bucket.id_list_raw.push(email.id);
                } else {
                    // We did not find the bucket, let's create a new one
                    let mut clean_subject = root_email.subject.clone().trim().to_string();
                    // Remove "Re: " from the beginning of the subject
                    if clean_subject.starts_with("Re: ") {
                        clean_subject = clean_subject.replace("Re: ", "");
                    }
                    if clean_subject.is_empty() {
                        continue;
                    }
                    buckets.push(EmailBucket {
                        root_email_id: Some(root_email.id),
                        id_list_raw: vec![email.id],
                        summary: Some(clean_subject),
                        ..Default::default()
                    });
                }
            };
        }

        // Let's group the emails by subject, keeping a vector of IDs for each email as value of the HashMap
        let mut subject_buckets: HashMap<String, Vec<i64>> = HashMap::new();
        for email in &emails {
            let mut clean_subject = email.subject.clone().trim().to_string();
            // Remove "Re: " from the beginning of the subject
            if clean_subject.starts_with("Re: ") {
                clean_subject = clean_subject.replace("Re: ", "");
            }
            if clean_subject.is_empty() {
                continue;
            }
            subject_buckets
                .entry(clean_subject)
                .and_modify(|x| x.push(email.id))
                .or_insert(vec![email.id]);
        }

        // If we have subject buckets with count > 1, then we create a new bucket for each subject
        // for (subject, vector) in subject_buckets {
        //     if vector.len() > 1 {
        //         buckets.push(EmailBucket {
        //             root_email_id: None,
        //             id_list_raw: vector,
        //             summary: Some(subject.clone()),
        //             ..Default::default()
        //         });
        //     }
        // }

        info!(
            "Found {} buckets\n Subjects: {}",
            buckets.len(),
            buckets
                .iter()
                .map(|x| format!(
                    "{}: {}",
                    x.root_email_id.as_ref().unwrap(),
                    x.summary.clone().unwrap()
                ))
                .collect::<Vec<String>>()
                .join("\n")
        );
        Ok(1000)
    }
}

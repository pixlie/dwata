use super::{app_state::EmailAccountsState, EmailAccount};
use super::{EmailAccountStatus, Mailbox};
use crate::email::helpers::{parse_email_from_file, store_emails_to_tantity};
use crate::email::EmailFull;
use crate::email_account::MailboxCreateUpdate;
use crate::error::DwataError;
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead};
use crate::workspace::{ProcessInLog, ProcessLogCreateUpdate, ProcessingStatusInLog};
use imap::Session;
use log::{error, info};
use native_tls::TlsStream;
use slug::slugify;
use sqlx::{Pool, Sqlite};
use std::collections::HashSet;
use std::fs::{create_dir_all, read_dir, File};
use std::io::{self, Read};
use std::net::TcpStream;
use std::ops::DerefMut;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::{sync::Mutex, task::JoinSet};

impl EmailAccount {
    pub async fn prep_for_access(
        &mut self,
        db: &Pool<Sqlite>,
        email_account_state: &EmailAccountsState,
    ) -> Result<Vec<String>, DwataError> {
        let imap_session = self.create_imap_session(db).await?;
        {
            let mut locked_state = email_account_state.lock().await;
            // Filter the vec of EmailAccountStatus to find the one that matches this EmailAccount
            let found = locked_state.iter_mut().find(|x| x.id == self.id);
            if let Some(x) = found {
                x.imap_session = Some(Arc::new(Mutex::new(imap_session)));
                info!("Stored IMAP session for {}", self.email_address);
            } else {
                locked_state.push(EmailAccountStatus {
                    id: self.id,
                    mailbox_names: vec![],
                    imap_session: Some(Arc::new(Mutex::new(imap_session))),
                });
            }
        }

        let mailbox_names = self.get_all_mailboxes(db, email_account_state).await?;
        {
            let mut locked_state = email_account_state.lock().await;
            // Filter the vec of EmailAccountStatus to find the one that matches this EmailAccount
            let found = locked_state.iter_mut().find(|x| x.id == self.id);
            if let Some(x) = found {
                x.mailbox_names = mailbox_names.clone();
            } else {
                return Err(DwataError::AppStateNotFound);
            }
        }
        Ok(mailbox_names)
    }

    pub async fn get_all_mailboxes(
        &mut self,
        _db: &Pool<Sqlite>,
        email_account_state: &EmailAccountsState,
    ) -> Result<Vec<String>, DwataError> {
        let imap_session = get_imap_session(self.id, email_account_state).await?;
        let mut imap_session = imap_session.lock().await;
        match imap_session.list(None, Some("*")) {
            Ok(mailboxes) => Ok(mailboxes.iter().map(|x| x.name().to_string()).collect()),
            Err(err) => {
                error!("Could not list mailboxes - {}", err);
                Err(DwataError::CouldNotListMailboxes)
            }
        }
    }
}

impl Mailbox {
    pub async fn fetch_emails(
        email_account_id: i64,
        mailbox_name: &str,
        storage_dir: &PathBuf,
        db: &Pool<Sqlite>,
        email_account_state: &EmailAccountsState,
    ) -> Result<Self, DwataError> {
        // We read emails using IMAP and store the raw messages in a local folder
        ProcessLogCreateUpdate {
            process: Some(ProcessInLog::FetchEmails),
            arguments: Some(vec![("name".to_string(), mailbox_name.to_string())]),
            status: Some(ProcessingStatusInLog::InProgress),
            is_sent_to_frontend: Some(false),
        }
        .insert_module_data(db)
        .await?;
        let mut storage_dir = storage_dir.clone();
        storage_dir.push(slugify(mailbox_name));
        if !storage_dir.as_path().exists() {
            create_dir_all(storage_dir.as_path()).unwrap();
        }
        // Let's examine the email mailbox to check the uid_validity value below
        let shared_imap_session = get_imap_session(email_account_id, email_account_state).await?;
        let mailbox = {
            let mut imap_session = shared_imap_session.lock().await;
            match imap_session.examine(mailbox_name) {
                Ok(mailbox) => mailbox,
                Err(err) => {
                    error!("Could not examine mailbox {}; Error: {}", mailbox_name, err);
                    return Err(DwataError::CouldNotFetchEmails);
                }
            }
        };
        let all_mailboxes_in_db = Mailbox::read_all(db).await?;
        let mailbox_in_db_opt = all_mailboxes_in_db
            .iter()
            .find(|x| x.email_account_id == email_account_id && x.name == mailbox_name);
        // By default we fetch all UIDs from 0
        let mut uid_from = 1;
        if let Some(mailbox_in_db) = mailbox_in_db_opt {
            if let Some(x) = mailbox_in_db.uid_next {
                if mailbox.uid_validity == mailbox_in_db.uid_validity {
                    // We have the same uid_validity as before, we fetch from our last uid_next
                    uid_from = x;
                }
            }
        }

        let email_uid_list = {
            let mut imap_session = shared_imap_session.lock().await;
            fetch_uid_list_of_emails(
                imap_session.deref_mut(),
                format!("{}", uid_from),
                "*".to_string(),
            )
            .await?
        };
        let email_uid_len = email_uid_list.len();

        // Let's fetch the actual emails, in batches        let fetch_batch_limit = 25;
        let fetch_batch_limit = 25;
        let mut fetch_email_set = JoinSet::new();
        let mut fetched_email_count = 0;

        while fetched_email_count < email_uid_len {
            let cloned_imap_session = shared_imap_session.clone();
            let cloned_storage_dir = storage_dir.clone();
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
                    fetch_emails_for_uid_list(batch, cloned_imap_session, cloned_storage_dir).await;
                });
            }
        }
        if fetch_email_set.len() > 0 {
            while let Some(_) = fetch_email_set.join_next().await {}
        }
        ProcessLogCreateUpdate {
            process: Some(ProcessInLog::FetchEmails),
            arguments: Some(vec![("name".to_string(), mailbox_name.to_string())]),
            status: Some(ProcessingStatusInLog::Completed),
            is_sent_to_frontend: Some(false),
        }
        .insert_module_data(db)
        .await?;
        info!("Finished all tasks to fetch emails");

        let mut imap_session = shared_imap_session.lock().await;
        match imap_session.logout() {
            Ok(_) => {}
            Err(err) => {
                error!("Could not logout IMAP session - {}", err);
            }
        }
        let mailbox_in_db = match mailbox_in_db_opt {
            Some(mailbox_in_db) => {
                let updates = MailboxCreateUpdate {
                    uid_next: mailbox.uid_next,
                    uid_validity: mailbox.uid_validity,
                    ..Default::default()
                };
                updates.update_module_data(mailbox_in_db.id, db).await?;
                Mailbox::read_one_by_pk(mailbox_in_db.id, db).await?
            }
            None => {
                // We store this mailbox that is not in the DB yet
                let new_mailbox_in_db = MailboxCreateUpdate {
                    email_account_id: Some(email_account_id),
                    name: Some(mailbox_name.to_string()),
                    storage_path: Some(format!("{}", storage_dir.to_string_lossy())),
                    messages: Some(mailbox.exists),
                    uid_next: mailbox.uid_next,
                    uid_validity: mailbox.uid_validity,
                };
                let response = new_mailbox_in_db.insert_module_data(db).await?;
                Mailbox::read_one_by_pk(response.pk, db).await?
            }
        };
        Ok(mailbox_in_db)
    }

    pub async fn read_emails_from_local_storage(
        &self,
        skip: usize,
        limit: usize,
    ) -> Result<Vec<EmailFull>, DwataError> {
        // We parse the files that are in the given email storage directory
        // and extract EmailFull structs.
        let mut emails: Vec<EmailFull> = vec![];
        // Read all email files in the local folder
        match read_dir(&self.storage_path) {
            Ok(entries) => {
                match entries
                    .map(|res| res.map(|e| e.path()))
                    .collect::<Result<Vec<_>, io::Error>>()
                {
                    Ok(mut entries) => {
                        // We sort by the file name but parsed as integer
                        entries.sort_by_key(|a| {
                            a.file_name()
                                .unwrap()
                                .to_string_lossy()
                                .to_string()
                                .parse::<i64>()
                                .unwrap_or(0)
                        });
                        entries.reverse();

                        for entry in entries.iter().skip(skip).take(limit) {
                            let path = entry.as_path();
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
                                match parse_email_from_file(
                                    &self,
                                    path.file_name().unwrap().to_string_lossy().to_string(),
                                    &file_contents,
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
                            self.storage_path, err
                        )
                    }
                }
            }
            Err(err) => {
                error!(
                    "Could not read email storage directory {}\n Error: {}",
                    self.storage_path, err
                )
            }
        }

        Ok(emails)
    }
}

pub async fn get_imap_session(
    email_account_id: i64,
    email_account_state: &EmailAccountsState,
) -> Result<Arc<Mutex<Session<TlsStream<TcpStream>>>>, DwataError> {
    let session = {
        let locked_state = email_account_state.lock().await;
        // Filter the vec of EmailAccountStatus to find the one that matches this EmailAccount
        match locked_state.iter().find(|x| x.id == email_account_id) {
            Some(x) => x.imap_session.clone(),
            None => None,
        }
    };
    if let Some(session) = session {
        Ok(session.clone())
    } else {
        Err(DwataError::AppStateNotFound)
    }
}

pub async fn fetch_and_save_emails_for_email_account(
    pk: i64,
    storage_dir: &PathBuf,
    db: &Pool<Sqlite>,
    email_account_state: &EmailAccountsState,
) -> Result<(), DwataError> {
    let mut email_account = EmailAccount::read_one_by_pk(pk, db).await?;
    let mut emails_storage_dir = storage_dir.clone();
    emails_storage_dir.push("emails");
    emails_storage_dir.push(email_account.email_address.clone());

    info!("Preparing Email account {}", email_account.email_address);
    let mailbox_names = email_account
        .prep_for_access(db, email_account_state)
        .await?;

    for mailbox_name in mailbox_names {
        let mailbox = Mailbox::fetch_emails(
            email_account.id,
            &mailbox_name,
            &emails_storage_dir,
            db,
            email_account_state,
        )
        .await?;
        info!("Fetche emails");

        let mut read_emails_count = 0;
        loop {
            let emails = mailbox
                .read_emails_from_local_storage(read_emails_count as usize, 1000)
                .await?;
            if emails.len() > 0 {
                store_emails_to_tantity(
                    &email_account.email_address,
                    &mailbox.name,
                    &emails,
                    storage_dir,
                )?;
            } else {
                break;
            }
            read_emails_count += 1000;
        }
    }

    Ok(())
}

pub async fn fetch_uid_list_of_emails(
    imap_session: &mut Session<TlsStream<TcpStream>>,
    from_uid: String,
    to_uid: String,
) -> Result<HashSet<u32>, DwataError> {
    match imap_session.uid_search(format!("UID {}:{}", from_uid, to_uid)) {
        Ok(data) => {
            info!(
                "Searched email UIDs from {} to {}, found {} Uids",
                from_uid,
                to_uid,
                &data.len()
            );
            Ok(data)
        }
        Err(err) => {
            error!(
                "(fetch_uid_list_of_emails) Error searching for emails; Searched UIDs from {} to {}; Error: {}",
                from_uid,
                to_uid,
                err
            );
            Err(DwataError::CouldNotFetchEmails)
        }
    }
}

pub async fn fetch_emails_for_uid_list(
    email_uid_list: Vec<u32>,
    shared_imap_session: Arc<Mutex<Session<TlsStream<TcpStream>>>>,
    storage_dir: PathBuf,
) {
    let mut imap_session = shared_imap_session.lock().await;
    // Let's find out if the files already exist.
    // If they do, then we don't need to fetch them again.
    let mut file_uid_list: Vec<u32> = vec![];
    for uid in email_uid_list {
        let mut file_path = storage_dir.clone();
        file_path.push(format!("{}", uid));
        if !file_path.exists() {
            file_uid_list.push(uid);
        }
    }

    match imap_session.uid_fetch(
        file_uid_list
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
                        file_path.push(format!("{}", message.uid.unwrap()));
                        std::fs::write(file_path, body).unwrap();
                    }
                    None => continue,
                }
            }
            info!("Fetched and stored {} emails", file_uid_list.len());
        }
        Err(e) => error!("Error Fetching email 1: {}", e),
    };
}

// pub async fn save_emails_to_db(email_batch: Vec<u32>, app: AppHandle) {
//     let mut db_guard = db.lock().await;
// }

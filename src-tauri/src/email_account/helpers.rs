use super::{app_state::EmailAccountsState, EmailAccount};
use super::{EmailAccountStatus, Mailbox};
use crate::email::helpers::{
    index_emails_in_tantity, parse_email_from_file, save_emails_to_dwata_db,
};
use crate::email::{Email, ParsedEmail};
use crate::error::DwataError;
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead};
use crate::workspace::db::DwataDB;
use crate::workspace::{ProcessInLog, ProcessLogCreateUpdate, ProcessingStatusInLog};
use imap::Session;
use log::{error, info};
use native_tls::TlsStream;
use slug::slugify;
use std::collections::HashSet;
use std::fs::{create_dir_all, read_dir, remove_dir_all, File};
use std::io::{self, Read};
use std::net::TcpStream;
use std::ops::DerefMut;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::{sync::Mutex, task::JoinSet};

impl EmailAccount {
    pub async fn prep_for_access(
        &mut self,
        email_account_state: &EmailAccountsState,
        db: &DwataDB,
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
        email_account_id: u32,
        mailbox_name: &str,
        storage_dir: &PathBuf,
        email_account_state: &EmailAccountsState,
    ) -> Result<i64, DwataError> {
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
        // TODO: Change to using read_with_filter
        let (all_mailboxes_in_db, _) = Mailbox::read_all(200, 0, db).await?;
        let mailbox_in_db_opt = all_mailboxes_in_db
            .iter()
            .find(|x| x.email_account_id == email_account_id && x.name == mailbox_name);
        let mut uid_from: i32 = 1;
        if let Some(mailbox_in_db) = mailbox_in_db_opt {
            if let Some(x) = mailbox_in_db.uid_next {
                if mailbox.uid_validity == mailbox_in_db.uid_validity {
                    // We have the same uid_validity as before, we fetch from our last uid_next
                    uid_from = x as i32;
                    if uid_from != 1
                        && mailbox.uid_next.is_some()
                        && mailbox.uid_next.unwrap() == uid_from as u32
                    {
                        // There are no new emails to fetch
                        info!("No new emails to fetch");
                        return Ok(mailbox_in_db.id);
                    }
                }
            }
        }

        let email_uid_list: HashSet<u32> = {
            if mailbox.exists == 0 {
                HashSet::new()
            } else if uid_from == 1
                && mailbox.uid_next.is_some()
                && mailbox.uid_next.unwrap() > 1000
            {
                info!(
                    "Fetching emails for large uid_next {}",
                    mailbox.uid_next.unwrap()
                );
                let mut imap_session = shared_imap_session.lock().await;
                // We have a large uid_next, let's fetch the emails for the last 1000 Uids
                uid_from = mailbox.uid_next.unwrap() as i32 - 1000;
                let mut batch = 1000;
                let mut temp: HashSet<u32> = HashSet::new();
                while uid_from > 0 {
                    temp.extend(
                        fetch_uid_list_of_emails(
                            imap_session.deref_mut(),
                            format!("{}", uid_from + 1),
                            format!("{}", uid_from + 1000),
                        )
                        .await?
                        .iter(),
                    );
                    uid_from -= 1000;
                    if uid_from < 1 && batch == 1000 {
                        batch = uid_from + 1000 - 1;
                        uid_from = 1;
                    }
                }
                temp
            } else {
                let mut imap_session = shared_imap_session.lock().await;
                fetch_uid_list_of_emails(
                    imap_session.deref_mut(),
                    format!("{}", uid_from),
                    "*".to_string(),
                )
                .await?
            }
        };
        let email_uid_len = email_uid_list.len();

        // Let's fetch the actual emails, in batches of fetch_batch_limit
        let fetch_batch_limit = 50;
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
            fetched_email_count += batch.len();
            // For the batch of email UIDs, we check if the file exists locally
            // We filter out these existing emails from the batch
            batch = batch
                .into_iter()
                .filter(|uid| !storage_dir.clone().join(uid.to_string()).as_path().exists())
                .collect();
            if batch.len() > 0 {
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

        let mailbox_id = match mailbox_in_db_opt {
            Some(mailbox_in_db) => {
                let updates = MailboxCreateUpdate {
                    storage_path: Some(storage_dir.to_string_lossy().to_string()),
                    messages: Some(mailbox.exists),
                    uid_next: mailbox.uid_next,
                    uid_validity: mailbox.uid_validity,
                    ..Default::default()
                };
                updates.update_module_data(mailbox_in_db.id, db).await?;
                mailbox_in_db.id
            }
            None => {
                // We store this mailbox that is not in the DB yet
                let new_mailbox_in_db = MailboxCreateUpdate {
                    email_account_id: Some(email_account_id),
                    name: Some(mailbox_name.to_string()),
                    storage_path: Some(storage_dir.to_string_lossy().to_string()),
                    messages: Some(mailbox.exists),
                    uid_next: mailbox.uid_next,
                    uid_validity: mailbox.uid_validity,
                    ..Default::default()
                };
                let response = new_mailbox_in_db.insert_module_data(db).await?;
                response.pk
            }
        };
        Ok(mailbox_id)
    }

    pub async fn read_emails_from_local_storage(
        &self,
        skip: usize,
        limit: usize,
    ) -> Result<Vec<ParsedEmail>, DwataError> {
        // We parse the files that are in the given email storage directory
        // and extract ParsedEmail structs.
        let mut emails = vec![];
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
    email_account_id: u32,
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

pub async fn fetch_and_index_emails_for_email_account(
    pk: u32,
    storage_dir: &PathBuf,
    email_account_state: &EmailAccountsState,
    db: &DwataDB,
) -> Result<(), DwataError> {
    let mut email_account = EmailAccount::read_one_by_key(pk, db).await?;
    let mut emails_storage_dir = storage_dir.clone();
    emails_storage_dir.push("emails");
    emails_storage_dir.push(email_account.email_address.clone());

    info!("Preparing Email account {}", email_account.email_address);
    let mailbox_names = email_account
        .prep_for_access(db, email_account_state)
        .await?;

    for mailbox_name in mailbox_names {
        if mailbox_name.to_lowercase().contains("all mail")
            || mailbox_name.to_lowercase().contains("all email")
            || mailbox_name.to_lowercase().contains("spam")
            || mailbox_name.to_lowercase().contains("trash")
        {
            // We skip mailboxes that are named "All Mail", "All Email", "Spam", "Trash" etc.
            continue;
        }
        info!("Fetching emails for mailbox {}", mailbox_name);
        let mailbox_id = match Mailbox::fetch_emails(
            email_account.id,
            &mailbox_name,
            &emails_storage_dir,
            db,
            email_account_state,
        )
        .await
        {
            Ok(x) => x,
            Err(err) => {
                error!(
                    "Could not fetch emails for mailbox {} - error: {}",
                    mailbox_name, err
                );
                continue;
            }
        };

        let mut read_emails_count = 0;
        loop {
            let mailbox = Mailbox::read_one_by_key(mailbox_id, db).await?;
            let emails = mailbox
                .read_emails_from_local_storage(read_emails_count as usize, 1000)
                .await?;
            let last_email_uid = match emails.last() {
                Some(x) => x.uid,
                None => 0,
            };
            let first_email_uid = match emails.first() {
                Some(x) => x.uid,
                None => 0,
            };
            if emails.len() > 0 {
                if mailbox.last_saved_email_uid.is_none()
                    || mailbox.last_saved_email_uid < mailbox.uid_next
                {
                    save_emails_to_dwata_db(&mailbox, &emails, db).await?;
                    let update_last_saved_email_id = MailboxCreateUpdate {
                        last_saved_email_uid: Some(last_email_uid),
                        ..Default::default()
                    };
                    update_last_saved_email_id
                        .update_module_data(mailbox_id, db)
                        .await?;
                    // Fetch all the email objects from Dwata DB that we saved in the previous step
                    let newly_saved_emails: Vec<Email> = query_as(
                        "SELECT * FROM email WHERE mailbox_id = ? AND uid >= ? AND uid <= ?",
                    )
                    .bind(mailbox.id)
                    .bind(first_email_uid)
                    .bind(last_email_uid)
                    .fetch_all(db)
                    .await?;
                    delete_emails_index_in_tantivy(storage_dir).unwrap();
                    index_emails_in_tantity(&mailbox, &newly_saved_emails, storage_dir)?;
                    let update_last_indexed_email_id = MailboxCreateUpdate {
                        last_indexed_email_uid: Some(last_email_uid),
                        ..Default::default()
                    };
                    update_last_indexed_email_id
                        .update_module_data(mailbox_id, db)
                        .await?;
                }
            } else {
                break;
            }
            read_emails_count += 1000;
        }
        info!("Stored emails for mailbox {} to tantivy", mailbox_name);
    }

    Ok(())
}

pub fn delete_emails_index_in_tantivy(storage_dir: &PathBuf) -> Result<(), DwataError> {
    let mut storage_dir = storage_dir.clone();
    storage_dir.push("search_index");
    if storage_dir.as_path().exists() {
        remove_dir_all(storage_dir.as_path()).unwrap();
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

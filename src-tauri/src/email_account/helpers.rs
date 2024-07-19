use imap::Session;
use log::{error, info};
use native_tls::TlsStream;
use std::{
    collections::HashSet,
    fs::{read_dir, File},
    io::{self, Read},
    net::TcpStream,
    path::PathBuf,
    sync::Arc,
};
use tauri::{AppHandle, Manager};
use tokio::sync::Mutex;

use crate::{email::Email, error::DwataError, workspace::DwataDb};

// pub async fn check_date_of_emails_in_storage(storage_dir: PathBuf) -> Result<bool, DwataError> {}

pub async fn fetch_email_uid_list(
    shared_email_uid_list: Arc<Mutex<HashSet<u32>>>,
    shared_imap_session: Arc<Mutex<Session<TlsStream<TcpStream>>>>,
    since_date: String,
    before_date: String,
) {
    let mut imap_session = shared_imap_session.lock().await;
    let mut email_uid_list = shared_email_uid_list.lock().await;
    match imap_session.uid_search(format!("SINCE {} BEFORE {}", since_date, before_date)) {
        Ok(data) => {
            for uid in &data {
                email_uid_list.insert(*uid);
            }
            info!(
                "Searched email Uids SINCE {} BEFORE {}, found {} email Uids",
                since_date,
                before_date,
                &data.len()
            );
        }
        Err(err) => {
            error!("Error searching for emails\n Error: {}", err);
        }
    }
}

pub async fn fetch_emails(
    email_batch: Vec<u32>,
    shared_imap_session: Arc<Mutex<Session<TlsStream<TcpStream>>>>,
    storage_dir: PathBuf,
) {
    let mut imap_session = shared_imap_session.lock().await;
    // Let's find out if the files already exist.
    // If they do, then we don't need to fetch them again.
    let mut file_uid_list: Vec<u32> = vec![];
    for uid in email_batch {
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

pub async fn read_emails_from_local_storage(
    storage_dir: PathBuf,
    limit: usize,
) -> Result<Vec<Email>, DwataError> {
    // We parse the files that are in the given email storage directory
    // and extract Email structs.
    let mut emails: Vec<Email> = vec![];
    info!(
        "Reading emails from local storage directory: {}",
        &storage_dir.to_str().unwrap()
    );
    // Read all email files in the local folder
    match read_dir(&storage_dir) {
        Ok(entries) => {
            match entries
                .map(|res| res.map(|e| e.path()))
                .collect::<Result<Vec<_>, io::Error>>()
            {
                Ok(mut entries) => {
                    entries.sort();

                    for entry in entries.iter().take(limit) {
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
                            match Email::parse_email_from_file(
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
                        &storage_dir.to_string_lossy(),
                        err
                    )
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

    Ok(emails)
}

pub async fn save_emails_to_db(email_batch: Vec<u32>, app: AppHandle) {
    let db = app.state::<DwataDb>();
    let mut db_guard = db.lock().await;
}

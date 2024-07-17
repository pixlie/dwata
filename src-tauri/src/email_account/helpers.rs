use imap::Session;
use log::{error, info};
use native_tls::TlsStream;
use std::{collections::HashSet, net::TcpStream, path::PathBuf, sync::Arc};
use tokio::sync::Mutex;

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
    email_uid_list: Vec<u32>,
    shared_imap_session: Arc<Mutex<Session<TlsStream<TcpStream>>>>,
    storage_dir: PathBuf,
) {
    let mut imap_session = shared_imap_session.lock().await;

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
                        file_path.push(format!("{}", message.uid.unwrap()));
                        std::fs::write(file_path, body).unwrap();
                    }
                    None => continue,
                }
            }
            info!("Fetched and stored {} emails", email_uid_list.len());
        }
        Err(e) => error!("Error Fetching email 1: {}", e),
    };
}

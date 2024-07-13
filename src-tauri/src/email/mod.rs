use crate::error::DwataError;
use chrono::{DateTime, FixedOffset, Utc};
use mail_parser::MessageParser;
use serde::Serialize;
use std::{
    fs::{read_dir, File},
    io::Read,
    path::PathBuf,
};
use ts_rs::TS;

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Email {
    // The UID of the email in the mailbox
    pub mail_uid: String,
    // The mailbox name
    pub mailbox: String,

    pub from: (String, String),
    pub date: DateTime<FixedOffset>,
    pub subject: String,
    pub body_text: String,

    pub created_at: DateTime<Utc>,
}

impl Email {
    pub async fn read_emails(storage_dir: &PathBuf) -> Result<Vec<Email>, DwataError> {
        // We read emails from the local folder and parse them to extract the Email struct
        let mut emails: Vec<Email> = vec![];
        // Read all email files in the local folder
        match read_dir(storage_dir) {
            Ok(entries) => {
                for entry in entries {
                    let entry = match entry {
                        Ok(x) => x,
                        Err(_) => continue,
                    };
                    let path = entry.path();
                    if path.is_file() {
                        // We read the file contents and parse it to extract the email
                        let mut file = match File::open(&path) {
                            Ok(x) => x,
                            Err(_) => continue,
                        };
                        let mut file_contents: Vec<u8> = Vec::new();
                        match file.read_to_end(&mut file_contents) {
                            Ok(_) => {}
                            Err(_) => continue,
                        };
                        match MessageParser::default().parse(&file_contents) {
                            Some(parsed) => {
                                let from = match parsed.from() {
                                    Some(from) => match from.first() {
                                        Some(first) => (
                                            first.name().unwrap().to_string(),
                                            first.address().unwrap().to_string(),
                                        ),
                                        None => continue,
                                    },
                                    None => continue,
                                };
                                let date = match parsed.date() {
                                    Some(dt) => {
                                        match DateTime::parse_from_rfc3339(&dt.to_rfc3339()) {
                                            Ok(dt) => dt,
                                            Err(_) => continue,
                                        }
                                    }
                                    None => {
                                        continue;
                                    }
                                };
                                let subject = match parsed.subject() {
                                    Some(subject) => subject.to_string(),
                                    None => continue,
                                };
                                let body_text = match parsed.body_text(0) {
                                    Some(body_text) => body_text.to_string(),
                                    None => continue,
                                };
                                emails.push(Email {
                                    mail_uid: entry.file_name().to_string_lossy().to_string(),
                                    mailbox: path
                                        .file_name()
                                        .unwrap()
                                        .to_string_lossy()
                                        .to_string(),
                                    from,
                                    date,
                                    subject,
                                    body_text,
                                    created_at: Utc::now(),
                                });
                            }
                            None => continue,
                        }
                    };
                }
            }
            Err(_) => {}
        }
        Ok(emails)
    }
}

use crate::error::DwataError;
use chrono::{DateTime, FixedOffset, Utc};
use log::error;
use mail_parser::MessageParser;
use serde::Serialize;
use std::{
    fs::{read_dir, File},
    io::Read,
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
    pub async fn parse_email_from_file(
        mail_uid: String,
        mailbox: String,
        email_file: Vec<u8>,
    ) -> Result<Email, DwataError> {
        match MessageParser::default().parse(&email_file) {
            Some(parsed) => {
                let from = match parsed.from() {
                    Some(from) => match from.first() {
                        Some(first) => (
                            first
                                .name()
                                .map_or_else(|| "".to_string(), |x| x.to_string()),
                            first.address().unwrap().to_string(),
                        ),
                        None => {
                            return Err(DwataError::CouldNotParseEmailFile);
                        }
                    },
                    None => {
                        return Err(DwataError::CouldNotParseEmailFile);
                    }
                };
                let date = match parsed.date() {
                    Some(dt) => match DateTime::parse_from_rfc3339(&dt.to_rfc3339()) {
                        Ok(dt) => dt,
                        Err(_) => {
                            return Err(DwataError::CouldNotParseEmailFile);
                        }
                    },
                    None => {
                        {
                            return Err(DwataError::CouldNotParseEmailFile);
                        };
                    }
                };
                let subject = match parsed.subject() {
                    Some(subject) => subject.to_string(),
                    None => {
                        return Err(DwataError::CouldNotParseEmailFile);
                    }
                };
                let body_text = match parsed.body_text(0) {
                    Some(body_text) => body_text.to_string(),
                    None => {
                        return Err(DwataError::CouldNotParseEmailFile);
                    }
                };
                return Ok(Email {
                    mail_uid,
                    mailbox,
                    from,
                    date,
                    subject,
                    body_text,
                    created_at: Utc::now(),
                });
            }
            None => {
                return Err(DwataError::CouldNotParseEmailFile);
            }
        }
    }
}

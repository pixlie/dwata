use crate::{error::DwataError, workspace::typesense::TypesenseField};
use chrono::DateTime;
use mail_parser::MessageParser;
use serde::Serialize;
use ts_rs::TS;

#[derive(Serialize, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct Email {
    // The UID of the email in the mailbox
    pub id: String,

    pub from_name: String,
    // pub from_email: String,
    pub date: i64,
    pub subject: String,
    pub body_text: String,
}

impl Email {
    pub async fn parse_email_from_file(
        mail_uid: String,
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
                        Ok(dt) => dt.timestamp(),
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
                    id: mail_uid,
                    from_name: from.0,
                    // from_email: from.1,
                    date,
                    subject,
                    body_text,
                });
            }
            None => {
                return Err(DwataError::CouldNotParseEmailFile);
            }
        }
    }

    pub fn get_typesense_fields() -> Vec<TypesenseField> {
        vec![
            TypesenseField {
                name: "id".to_string(),
                field_type: "string".to_string(),
                ..Default::default()
            },
            TypesenseField {
                name: "from_name".to_string(),
                field_type: "string".to_string(),
                ..Default::default()
            },
            // TypesenseField {
            //     name: "from_email".to_string(),
            //     field_type: "string".to_string(),
            //     ..Default::default()
            // },
            TypesenseField {
                name: "date".to_string(),
                field_type: "int64".to_string(),
                facet: Some(true),
                ..Default::default()
            },
            TypesenseField {
                name: "subject".to_string(),
                field_type: "string".to_string(),
                ..Default::default()
            },
            TypesenseField {
                name: "body_text".to_string(),
                field_type: "string".to_string(),
                store: Some(false),
                ..Default::default()
            },
        ]
    }
}

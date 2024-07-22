use crate::error::DwataError;
use crate::workspace::typesense::{
    TypesenseEmbedding, TypesenseEmbeddingModelConfig, TypesenseField,
};
use chrono::DateTime;
use mail_parser::MessageParser;
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};
use ts_rs::TS;

pub mod crud;

#[derive(Default, Deserialize, Serialize, FromRow, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct Email {
    // The Uid of the email in the mailbox
    #[ts(type = "number")]
    pub id: i64,
    #[ts(type = "number")]
    pub uid: i64,
    pub mailbox_id: i64,

    #[serde(skip)]
    pub message_id: Option<String>,
    #[serde(skip)]
    pub in_reply_to: Option<String>,

    pub from_name: String,
    pub from_email: String,
    pub date: i64,
    pub subject: String,

    pub body_text: String,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct SearchableEmail {
    pub id: String,
    pub from_name: String,
    pub from_email: String,
    pub date: i64,
    pub subject: String,
    #[serde(skip_deserializing)]
    pub body_text: String,
}

pub struct EmailCreateUpdate {
    pub from_name: Option<String>,
    pub from_email: Option<String>,
    pub date: Option<i64>,
    pub subject: Option<String>,
    pub body_text: Option<String>,
}

impl Email {
    pub async fn parse_email_from_file(
        mail_uid: String,
        email_file: &[u8],
    ) -> Result<Email, DwataError> {
        match MessageParser::default().parse(email_file) {
            Some(parsed) => {
                let from = parsed.from().ok_or(DwataError::CouldNotParseEmailFile)?;
                let from = from.first().ok_or(DwataError::CouldNotParseEmailFile)?;
                let from = (
                    from.name()
                        .map_or_else(|| "".to_string(), |x| x.to_string()),
                    from.address().unwrap().to_string(),
                );

                let date = parsed.date().ok_or(DwataError::CouldNotParseEmailFile)?;
                let date = match DateTime::parse_from_rfc3339(&date.to_rfc3339()) {
                    Ok(dt) => dt.timestamp(),
                    Err(_) => return Err(DwataError::CouldNotParseEmailFile),
                };

                let subject = parsed.subject().ok_or(DwataError::CouldNotParseEmailFile)?;
                let body_text = parsed
                    .body_text(0)
                    .ok_or(DwataError::CouldNotParseEmailFile)?;

                return Ok(Email {
                    id: mail_uid.parse::<i64>().unwrap(),
                    uid: mail_uid.parse::<i64>().unwrap(),
                    message_id: parsed.message_id().map(|x| x.to_string()),
                    in_reply_to: parsed.in_reply_to().as_text().map(|x| x.to_string()),
                    from_name: from.0,
                    from_email: from.1,
                    date,
                    subject: subject.to_string(),
                    body_text: body_text.to_string(),
                    ..Default::default()
                });
            }
            None => return Err(DwataError::CouldNotParseEmailFile),
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
            TypesenseField {
                name: "from_email".to_string(),
                field_type: "string".to_string(),
                ..Default::default()
            },
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
            TypesenseField {
                name: "embedding".to_string(),
                field_type: "float[]".to_string(),
                embed: Some(TypesenseEmbedding {
                    from: vec![
                        "subject".to_string(),
                        "from_name".to_string(),
                        "body_text".to_string(),
                    ],
                    model_config: TypesenseEmbeddingModelConfig {
                        model_name: "ts/jina-embeddings-v2-base-en".to_string(),
                    },
                }),
                ..Default::default()
            },
        ]
    }
}

#[derive(Default, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailBucket {
    #[ts(type = "number")]
    pub id: i64,
    // This is generally the root of a thread, can be null for buckets of similar emails, etc.
    #[ts(type = "number")]
    pub root_email_id: Option<i64>,

    #[ts(type = "Array<number>")]
    pub id_list: Json<Vec<i64>>,

    #[serde(skip)]
    #[sqlx(skip)]
    #[ts(skip)]
    pub id_list_raw: Vec<i64>,

    pub summary: Option<String>,

    // If this is a bucket of emails in a thread
    pub are_in_a_thread: Option<bool>,

    // If this is a bucket of similar emails, like bank notifications of same kind
    pub are_similar: Option<bool>,
    // If this is a bucket of emails from a contact
    // pub contact_id: Option<i64>,

    // If this is a bucket of emails with a label
    // pub label_id: Option<i64>,
}

pub struct EmailBucketCreateUpdate {
    pub root_email_id: Option<i64>,
    pub id_list: Vec<i64>,
    pub summary: Option<String>,
    pub are_in_a_thread: Option<bool>,
    pub are_similar: Option<bool>,
    // pub contact_id: Option<i64>,
    // pub label_id: Option<i64>,
}

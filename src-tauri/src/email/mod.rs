use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, types::Json, Type};
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod commands;
pub mod crud;
pub mod helpers;
pub mod tests;

#[derive(Deserialize, Serialize, TS, Type, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
pub enum EmailFlag {
    Seen,
    Answered,
    Flagged,
    Deleted,
    Draft,
    Recent,
    MayCreate,
}

#[derive(Default, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Email {
    #[ts(type = "number")]
    pub id: i64,

    // The UID of the email in the mailbox
    #[ts(type = "number")]
    pub uid: u32,

    #[ts(type = "number")]
    pub mailbox_id: i64,

    pub from_email_address: String,

    // Contacts are processed after saving emails and it depends on certain logic
    #[ts(type = "number")]
    pub from_contact_id: Option<i64>,

    #[ts(type = "number")]
    pub date: i64,
    pub subject: String,
    pub body_text: Option<String>,
    // pub flag: Option<EmailFlag>,

    // This is from email headers
    pub message_id: Option<String>,
    // This is from email headers
    #[ts(type = "Array<string>")]
    pub in_reply_to: Json<Vec<String>>,

    // When this email is a reply to another email
    #[ts(type = "number")]
    pub parent_email_id: Option<i64>,
}

pub struct ParsedEmail {
    pub uid: u32,
    pub mailbox_id: i64,
    pub message_id: Option<String>,
    pub in_reply_to: Vec<String>,
    pub from_name: String,
    pub from_email: String,
    pub date: i64,
    pub subject: String,
    pub body_text: String,
    // pub flag: Option<EmailFlag>,
}

pub struct SearchedEmail {
    pub email_id: i64,
}

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailFilters {
    #[ts(type = "Array<number>")]
    pub email_account_id_list: Option<Vec<i64>>,
    // pub from_name: Option<String>,
    // pub from_email: Option<String>,
    // #[ts(type = "number")]
    // pub date_from: Option<i64>,
    // #[ts(type = "number")]
    // pub date_to: Option<i64>,
    // pub subject: Option<String>,
    pub search_query: Option<String>,
}

pub struct EmailCreateUpdate {
    pub parent_email_id: Option<i64>,
}

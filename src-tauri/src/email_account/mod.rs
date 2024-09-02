use chrono::{DateTime, Utc};
use imap::Session;
use native_tls::TlsStream;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};
use std::net::TcpStream;
use std::sync::Arc;
use strum::{Display, EnumString};
use tokio::sync::Mutex;
use ts_rs::TS;

pub mod api;
pub mod app_state;
pub mod commands;
pub mod crud;
pub mod helpers;
pub mod providers;

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

pub struct EmailAccountStatus {
    pub id: i64,
    pub mailbox_names: Vec<String>,
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
    pub oauth2_token_id: Option<i64>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailAccountCreateUpdate {
    pub provider: Option<String>,
    pub email_address: Option<String>,
    pub password: Option<String>,
    pub oauth2_app_id: Option<i64>,
    // pub oauth2_token_id: Option<i64>,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Mailbox {
    #[ts(type = "number")]
    pub id: i64,
    #[ts(type = "number")]
    pub email_account_id: i64,
    pub name: String,

    #[ts(skip)]
    #[serde(skip)]
    pub storage_path: String,

    // Total number of messages in this mailbox as per IMAP server
    #[ts(skip)]
    #[serde(skip)]
    messages: Option<u32>,
    // The stored uid_next value is the last email we have fetched from this mailbox
    #[ts(skip)]
    #[serde(skip)]
    uid_next: Option<u32>,
    #[ts(skip)]
    #[serde(skip)]
    uid_validity: Option<u32>,

    // We have saved emails till this id in Dwata DB
    #[ts(skip)]
    #[serde(skip)]
    last_saved_email_uid: Option<u32>,

    // We have indexed emails till this id in our search index
    #[ts(skip)]
    #[serde(skip)]
    last_indexed_email_uid: Option<u32>,
    // #[ts(skip)]
    // #[serde(skip)]
    // last_contact_processed_email_uid: Option<u32>,
}

#[derive(Default)]
pub struct MailboxCreateUpdate {
    pub email_account_id: Option<i64>,
    pub name: Option<String>,
    pub storage_path: Option<String>,
    pub messages: Option<u32>,
    pub uid_next: Option<u32>,
    pub uid_validity: Option<u32>,
    pub last_saved_email_uid: Option<u32>,
    pub last_indexed_email_uid: Option<u32>,
}

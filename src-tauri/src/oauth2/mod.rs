use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod api;
pub mod crud;
pub mod helpers;

#[derive(Debug, Deserialize, Serialize, Clone, TS, Type, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
#[ts(export)]
pub enum OAuth2Provider {
    Google,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct OAuth2 {
    #[ts(type = "number")]
    pub id: i64,

    pub provider: OAuth2Provider,
    pub client_id: String,
    pub client_secret: Option<String>,

    pub authorization_code: String,
    pub access_token: String,
    pub refresh_token: Option<String>,
    // Unique id sent from provider
    pub identifier: String,
    // Email address, username, etc.
    pub handle: Option<String>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct OAuth2CreateUpdate {
    pub provider: Option<String>,
    pub client_id: Option<String>,
    pub client_secret: Option<String>,
    // pub authorization_code: String,
    // pub access_token: String,
    // pub refresh_token: Option<String>,
    // pub identifier: String,
}

pub struct Oauth2APIResponse {
    pub authorization_code: String,
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub identifier: String,
    pub handle: Option<String>,
}

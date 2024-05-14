use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};
use ts_rs::TS;

pub(crate) mod commands;
pub(crate) mod crud;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(
    export,
    rename = "APIUserAccount",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct UserAccount {
    // First user, with ID one is used as default user
    id: i64,
    first_name: String,
    last_name: Option<String>,
    email: Option<String>,
    // Users that provide services within Dwata
    is_system_user: bool,
    // Users that represent and AI model
    is_ai_user: bool,
    #[ts(type = "string")]
    created_at: DateTime<Utc>,
}

impl UserAccount {
    pub fn from_sqlx_row(row: &UserAccountRow) -> Self {
        Self {
            id: row.id,
            first_name: row.json_data.0.first_name.to_string(),
            last_name: row.json_data.0.last_name.clone(),
            email: row.json_data.0.email.clone(),
            is_system_user: row.json_data.0.is_system_user,
            is_ai_user: row.json_data.0.is_ai_user,
            created_at: row.created_at,
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct UserAccountJson {
    first_name: String,
    last_name: Option<String>,
    email: Option<String>,
    // Users that provide services within Dwata
    is_system_user: bool,
    // Users that represent and AI model
    is_ai_user: bool,
}

#[derive(FromRow)]
pub(crate) struct UserAccountRow {
    id: i64,
    json_data: Json<UserAccountJson>,
    created_at: DateTime<Utc>,
}

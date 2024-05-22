use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use ts_rs::TS;

pub mod configuration;
pub mod crud;

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct UserAccount {
    // First user, with ID one is used as default user
    pub id: i64,
    pub first_name: String,
    pub last_name: Option<String>,
    pub email: Option<String>,
    // Users that provide services within Dwata
    pub is_system_user: Option<bool>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct UserAccountCreateUpdate {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
}

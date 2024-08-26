use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use ts_rs::TS;

pub mod api;
pub mod crud;

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct UserAccount {
    // First user, with ID one is used as default user
    #[ts(type = "number")]
    pub id: i64,
    pub first_name: String,
    pub last_name: Option<String>,
    pub email: Option<String>,
    // Users that provide services within Dwata
    pub is_system_user: Option<bool>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct UserAccountCreateUpdate {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
}

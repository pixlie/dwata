use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

mod api_types;
pub(crate) mod commands;
pub(crate) mod crud;

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct UserAccount {
    // First user, with ID one is used as default user
    id: i64,
    first_name: String,
    last_name: Option<String>,
    email: String,
    // Users that provide services within Dwata
    is_system_user: bool,
    // Users that represent and AI model
    is_ai_user: bool,
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct UserAccountJson {
    first_name: String,
    last_name: Option<String>,
    email: String,
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

use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

pub(crate) mod commands;
pub(crate) mod crud;

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct UserProfile {
    id: i64,
    first_name: String,
    last_name: Option<String>,
    email: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct UserAccount {
    // First user, with ID one is used as default user
    id: i64,

    // Users that provide services within Dwata
    is_system_user: bool,
    // Users that represent and AI model
    is_ai_user: bool,
}

#[derive(FromRow)]
pub(crate) struct UserAccountRow {
    id: i64,
    json_data: Json<UserAccount>,
}

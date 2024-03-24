use crate::user_account::UserAccountRow;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct APIUserAccount {
    // First user, with ID one is used as default user
    id: i64,
    first_name: String,
    last_name: Option<String>,
    email: String,
    // Users that provide services within Dwata
    is_system_user: bool,
    // Users that represent and AI model
    is_ai_user: bool,
    created_at: String,
}

impl APIUserAccount {
    pub fn from_sqlx_row(row: &UserAccountRow) -> Self {
        Self {
            id: row.id,
            first_name: row.json_data.0.first_name.to_string(),
            last_name: row.json_data.0.last_name.clone(),
            email: row.json_data.0.email.to_string(),
            is_system_user: row.json_data.0.is_system_user,
            is_ai_user: row.json_data.0.is_ai_user,
            created_at: row.created_at.to_rfc3339(),
        }
    }
}

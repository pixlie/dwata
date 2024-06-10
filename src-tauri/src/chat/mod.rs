use std::str::FromStr;

use chrono::{DateTime, Utc};
// use crate::chat::api_types::APIChatContextNode;
use chrono::serde::ts_milliseconds;
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow, Type};
use ts_rs::TS;

use crate::error::DwataError;

pub mod configuration;
pub mod crud;

#[derive(Serialize, Type, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub enum Role {
    User,
    Assistant,
    System,
}

impl FromStr for Role {
    type Err = DwataError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "user" => Ok(Role::User),
            "assistant" => Ok(Role::Assistant),
            "system" => Ok(Role::System),
            _ => Err(DwataError::InvalidChatRole),
        }
    }
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub struct ChatToolResponse {
    pub tool_name: String,
    pub tool_type: String,
    pub arguments: String,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Chat {
    #[ts(type = "number")]
    pub id: i64,

    // This is null for the first chat
    pub root_chat_id: Option<i64>,

    pub role: Option<Role>,
    // In case there is a tool response from AI model, there may not be a message
    pub message: Option<String>,
    // Dwata will set the prompt to request LLM to respond in the requested format
    // pub requested_content_format: Option<ContentFormat>,

    // Default is empty vector
    #[ts(type = "Vec<ChatToolResponse>")]
    pub tool_response: Option<Json<Vec<ChatToolResponse>>>,

    // These are messages created by Dwata to get meta information,
    // shown to user only when they want
    pub is_system_chat: bool,

    // For prompts that need to be processed by an AI model
    pub requested_ai_model: Option<String>,
    pub is_processed_by_ai: Option<bool>,

    // Only stored if there is an API error
    pub api_error_response: Option<String>,

    // User who posted this reply, if this reply was created by user
    pub created_by_id: Option<i64>,

    #[serde(with = "ts_milliseconds")]
    pub created_at: DateTime<Utc>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ChatCreateUpdate {
    pub role: Option<String>,
    pub root_chat_id: Option<i64>,
    pub message: Option<String>,
    // pub requested_content_format: Option<String>,
    pub requested_ai_model: Option<String>,
    pub tool_response: Option<Vec<ChatToolResponse>>,
    pub is_processed_by_ai: Option<bool>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ChatFilters {
    pub role: Option<String>,
    #[ts(type = "number")]
    pub root_chat_id: Option<i64>,
    pub root_chat_null: Option<bool>,
    pub requested_ai_model: Option<String>,
}

// pub(crate) trait ChatContextNode {
//     fn get_self_chat_context_node(&self) -> APIChatContextNode;

//     fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode>;

//     async fn get_chat_context(&self, node_path: &[String]) -> Result<String, DwataError>;
// }

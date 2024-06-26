use chrono::{DateTime, Utc};
// use crate::chat::api_types::APIChatContextNode;
use chrono::serde::ts_milliseconds;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod configuration;
pub mod crud;

#[derive(Deserialize, Serialize, Type, TS, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
#[ts(export)]
pub enum Role {
    User,
    Assistant,
    System,
}

// #[derive(Deserialize, Serialize, TS)]
// #[ts(export)]
// pub struct ChatToolResponse {
//     pub tool_name: String,
//     pub tool_type: String,
//     pub arguments: String,
// }

#[derive(Default, Deserialize, Serialize, TS, Type, EnumString, Display)]
#[serde(rename_all = "snake_case")]
#[sqlx(rename_all = "snake_case")]
#[strum(serialize_all = "snake_case")]
#[ts(export)]
pub enum ProcessStatus {
    #[default]
    NotApplicable,
    Pending,
    ResponseReceived,
    ErrorReceived,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Chat {
    #[ts(type = "number")]
    pub id: i64,

    // This is null for the first chat
    #[ts(type = "number")]
    pub root_chat_id: Option<i64>,

    pub role: Option<Role>,
    // In case there is a tool response from AI model, there may not be a message
    pub message: Option<String>,
    // Dwata will set the prompt to request LLM to respond in the requested format
    // pub requested_content_format: Option<ContentFormat>,

    // These are messages created by Dwata to get meta information,
    // shown to user only when they want
    // pub is_system_chat: bool,

    // For prompts that need to be processed by an AI model
    pub requested_ai_model: Option<String>,
    pub process_status: Option<ProcessStatus>,

    // Only stored if there is an API error
    // pub api_error_response: Option<String>,
    #[serde(with = "ts_milliseconds")]
    pub created_at: DateTime<Utc>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct ChatCreateUpdate {
    pub role: Option<String>,
    #[ts(type = "number")]
    pub root_chat_id: Option<i64>,
    pub message: Option<String>,
    // pub requested_content_format: Option<String>,
    pub requested_ai_model: Option<String>,
    // pub tool_response: Option<Vec<ChatToolResponse>>,
    pub process_status: Option<String>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
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

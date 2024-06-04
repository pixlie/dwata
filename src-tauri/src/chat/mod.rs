use chrono::{DateTime, Utc};
// use crate::chat::api_types::APIChatContextNode;
use chrono::serde::ts_milliseconds;
use serde::Serialize;
use sqlx::{types::Json, FromRow, Type};
use ts_rs::TS;

// pub mod commands;
pub mod configuration;
pub mod crud;

#[derive(Serialize, FromRow, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub struct ChatToolResponse {
    pub tool_name: String,
    pub tool_type: String,
    pub arguments: String,
}

#[derive(Serialize, TS, Type)]
#[ts(export, export_to = "../src/api_types/")]
pub enum ContentFormat {
    Text,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct Chat {
    id: i64,

    // This is null for the first chat
    previous_chat_id: Option<i64>,

    // In case there is a tool response from AI model, there may not be a message
    message: Option<String>,
    // Dwata will set the prompt to request LLM to respond in the requested format
    requested_content_format: Option<ContentFormat>,

    // Default is empty vector
    #[ts(type = "Vec<ChatToolResponse>")]
    tool_response: Json<Vec<ChatToolResponse>>,

    // These are messages created by Dwata to get meta information,
    // shown to user only when they want
    is_system_chat: bool,

    // For prompts that need to be processed by an AI model
    requested_ai_model_id: Option<i64>,
    is_processed_by_ai: Option<bool>,

    // Only stored if there is an API error
    api_error_response: Option<String>,

    // User who posted this reply, if this reply was created by user
    created_by_id: Option<i64>,

    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

// pub(crate) trait ChatContextNode {
//     fn get_self_chat_context_node(&self) -> APIChatContextNode;

//     fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode>;

//     async fn get_chat_context(&self, node_path: &[String]) -> Result<String, DwataError>;
// }

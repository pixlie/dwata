// use crate::chat::api_types::APIChatContextNode;
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};
use ts_rs::TS;

// pub(crate) mod api_types;
// pub(crate) mod commands;
// mod crud;
// mod helpers;

#[derive(Debug, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ChatThread {
    id: i64,
    title: String,
    summary: Option<String>,
    labels: Vec<String>,

    // Default AI integration and model for replies in this thread
    ai_model_id: Option<i64>,

    created_by_id: i64,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
pub struct ChatToolResponse {
    pub tool_name: String,
    pub tool_type: String,
    pub arguments: String,
}

#[derive(Debug, Serialize, TS)]
pub enum ContentFormat {
    Text,
}

#[derive(Debug, Serialize, FromRow, TS)]
pub(crate) struct ChatReply {
    id: i64,
    chat_thread_id: i64,

    // In case there is a tool response, there may not be a string message
    message: Option<String>,
    // Dwata will set the prompt to request LLM to respond in the requested format
    requested_content_format: Option<ContentFormat>,

    // Default is empty vector
    #[ts(type = "Vec<ChatToolResponse>")]
    tool_response: Json<Vec<ChatToolResponse>>,

    // These are messages created by Dwata to get meta information about a chat,
    // shown to user only when they want
    is_system_chat: Option<bool>,

    // For prompts that need to be processed by an AI model and
    // in case the model is different from the default model for this thread
    ai_model_id: Option<i64>,
    // For messages that need to be processed by AI
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

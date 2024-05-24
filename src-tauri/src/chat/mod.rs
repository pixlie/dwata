// use crate::chat::api_types::APIChatContextNode;
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use ts_rs::TS;

// pub(crate) mod api_types;
// pub(crate) mod commands;
// mod crud;
// mod helpers;

#[derive(Debug, FromRow, Serialize)]
pub(crate) struct Thread {
    id: i64,
    title: String,
    summary: Option<String>,
    labels: Vec<String>,

    // Default AI model for chats in this thread
    ai_model_id: Option<i64>,

    created_by_id: i64,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatToolResponse {
    tool_name: String,
    tool_type: String,
    arguments: String,
}

impl ChatToolResponse {
    pub fn new(tool_name: String, tool_type: String, arguments: String) -> Self {
        Self {
            tool_name,
            tool_type,
            arguments,
        }
    }
}

#[derive(Debug, Serialize, FromRow, TS)]
pub(crate) struct Reply {
    id: i64,
    thread_id: i64,

    // In case there is a tool response, the message is a blank string
    message: Option<String>,

    // #[serde(skip_serializing_if = "Option::is_none")]
    // tool_response: Option<Vec<ChatToolResponse>>,

    // These are messages created by Dwata to get meta information about a chat,
    // shown to user only when they want
    is_system_message: Option<bool>,

    // For prompts that need to be processed by an AI model and
    // in case the model is different from the default model for this thread
    ai_model_id: Option<i64>,
    // For messages that need to be processed by AI, either system generated prompts or general user prompt
    is_processed_by_ai: Option<bool>,

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

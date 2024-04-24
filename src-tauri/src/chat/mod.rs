use crate::chat::api_types::APIChatContextNode;
use crate::error::DwataError;
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

pub(crate) mod api_types;
pub(crate) mod commands;
mod crud;
mod helpers;

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatThreadJson {
    title: String,
    summary: Option<String>,
    labels: Vec<String>,
    ai_provider: String,
    ai_model: String,
}

#[derive(Debug, FromRow, Serialize)]
pub(crate) struct ChatThreadRow {
    id: i64,
    json_data: Json<ChatThreadJson>,
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

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatReplyJson {
    // In case there is a tool response, the message is a blank string
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    tool_response: Option<Vec<ChatToolResponse>>,
    // These are messages created by Dwata to get meta information about a chat,
    // shown to user only when they want
    is_system_message: Option<bool>,
    // Messages that need to be sent to AI, either system messages or general user chat
    is_to_be_sent_to_ai: Option<bool>,
    is_sent_to_ai: bool,
}

impl ChatReplyJson {
    pub fn new(
        message: String,
        tool_response: Option<Vec<ChatToolResponse>>,
        is_system_message: bool,
        is_to_be_sent_to_ai: bool,
        is_sent_to_ai: bool,
    ) -> Self {
        Self {
            message,
            tool_response,
            is_system_message: if is_system_message { Some(true) } else { None },
            is_to_be_sent_to_ai: if is_to_be_sent_to_ai {
                Some(true)
            } else {
                None
            },
            is_sent_to_ai,
        }
    }
}

#[derive(Debug, FromRow, Serialize)]
pub(crate) struct ChatReplyRow {
    id: i64,
    json_data: Json<ChatReplyJson>,
    chat_thread_id: i64,
    // User who posted this chat, including LLM
    created_by_id: i64,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

pub(crate) trait ChatContextNode {
    fn get_self_chat_context_node(&self) -> APIChatContextNode;

    fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode>;

    async fn get_chat_context(&self, node_path: &[String]) -> Result<String, DwataError>;
}

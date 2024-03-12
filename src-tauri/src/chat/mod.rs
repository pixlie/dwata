// use crate::ai::{AiModel, AiProvider};
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

mod api_types;
pub(crate) mod commands;
mod crud;
mod helpers;

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatThread {
    id: i64,
    title: String,
    summary: Option<String>,
    labels: Vec<String>,
    ai_provider: String,
    ai_model: String,
    created_by_id: i64,
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatThreadJson {
    title: String,
    summary: Option<String>,
    labels: Vec<String>,
    ai_provider: String,
    ai_model: String,
}

#[derive(FromRow)]
pub(crate) struct ChatThreadRow {
    id: u32,
    json_data: Json<ChatThreadJson>,
    created_by_id: i64,
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatReply {
    id: u32,

    // Stored in Markdown
    message: String,

    chat_thread_id: i64,
    // User who posted this chat, including LLM
    created_by_id: i64,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatReplyJson {
    message: String,
}

#[derive(FromRow)]
pub(crate) struct ChatReplyRow {
    id: u32,
    data_json: Json<ChatReply>,
    chat_thread_id: i64,
    created_by_id: i64,
    created_at: DateTime<Utc>,
}

// impl ChatReply {
//     pub fn new(created_by: u32, message: String) -> Self {
//         Self {
//             id: 1223,
//             created_by,
//             message,
//             created_at: Utc::now(),
//         }
//     }
// }

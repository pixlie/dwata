use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

mod api_types;
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

#[derive(FromRow, Serialize)]
pub(crate) struct ChatThreadRow {
    id: i64,
    json_data: Json<ChatThreadJson>,
    created_by_id: i64,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatReplyJson {
    message: String,
    is_sent_to_ai: bool,
}

#[derive(FromRow, Serialize)]
pub(crate) struct ChatReplyRow {
    id: i64,
    json_data: Json<ChatReplyJson>,
    chat_thread_id: i64,
    // User who posted this chat, including LLM
    created_by_id: i64,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
}

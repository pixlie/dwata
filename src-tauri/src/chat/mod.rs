// use crate::ai::{AiModel, AiProvider};
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

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
}

// #[derive(FromRow)]
// pub(crate) struct ChatThreadRow {
//     id: u32,
//     data_json: Json<ChatThread>,
// }

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatReply {
    id: u32,

    // Stored in Markdown
    message: String,

    thread_id: u32,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
    // User who posted this chat, including LLM
    created_by: u32,
}

// #[derive(FromRow)]
// pub(crate) struct ChatReplyRow {
//     id: u32,
//     data_json: Json<ChatReply>,
// }

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

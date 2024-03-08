use crate::ai::{AiModel, AiProvider};
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{query, types::Json, FromRow, SqliteConnection};

mod crud;
pub mod helpers;

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct ChatThread {
    id: u32,
    title: String,
    summary: Option<String>,
    labels: Vec<String>,
    ai_provider: AiProvider,
    ai_model: AiModel,
}

#[derive(FromRow)]
pub(crate) struct ChatThreadRow {
    id: u32,
    data_json: Json<ChatThread>,
}

// impl ChatThread {
//     pub fn new(message: String, ai_provider: AiProvider, ai_model: AiModel, connection: &SqliteConnection) -> Self {
//         let title: String = message
//             .get(..60)
//             .unwrap_or_else(|_| message.get(..message.len() - 1).unwrap())
//             .to_string();
//         query("INSERT INTO chat_thread (data_json) VALUES ( ?1 )")
//         // Self { title }
//     }
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

#[derive(FromRow)]
pub(crate) struct ChatReplyModel {
    id: u32,
    data_json: Json<ChatReply>,
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

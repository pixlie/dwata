use crate::ai::{AiModel, AiProvider};
use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

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

// struct ChatThreadRecord {
//     id:
// }

// impl ChatThread {
//     pub fn new(message: String) -> Self {
//         Self {}
//     }
//
//     fn save_to_disk(&self) {}
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

// impl ChatItem {
//     pub fn new(created_by: u32, message: String) -> Self {
//         Self {
//             id: 1223,
//             created_by,
//             message,
//             created_at: Utc::now(),
//         }
//     }
// }

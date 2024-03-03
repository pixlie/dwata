use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

pub mod helpers;

#[derive(Debug, Deserialize, Serialize)]
pub struct ChatThread {
    id: u32,
    title: Option<String>,
    summary: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ChatItem {
    id: u32,

    // User who posted this chat, including LLM
    created_by: u32,

    // Stored in Markdown
    message: String,
    #[serde(with = "ts_milliseconds")]
    created_at: DateTime<Utc>,
    // labels: Vec<String>,
}

impl ChatItem {
    pub fn new(created_by: u32, message: String) -> Self {
        Self {
            id: 1223,
            created_by,
            message,
            created_at: Utc::now(),
        }
    }
}

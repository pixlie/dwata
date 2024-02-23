pub mod helpers;

use chrono::serde::ts_milliseconds;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct ChatThread {
    id: u32,
    title: String,
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

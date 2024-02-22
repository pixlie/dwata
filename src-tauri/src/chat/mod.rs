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
    created_by: u32, // User who posted this chat, including LLM
    message: String, // Stored in Markdown
    created_at: DateTime<Utc>,
    labels: Vec<String>,
}

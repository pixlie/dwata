use crate::chat::{ChatReplyRow, ChatThreadRow};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct APIChatThread {
    id: i64,
    title: String,
    summary: Option<String>,
    labels: Vec<String>,
    ai_provider: String,
    ai_model: String,
    created_by_id: i64,
    created_at: String,
}

impl APIChatThread {
    pub fn from_sqlx_row(row: &ChatThreadRow) -> Self {
        Self {
            id: row.id,
            title: row.json_data.0.title.to_string(),
            summary: row.json_data.0.summary.clone(),
            labels: row.json_data.0.labels.clone(),
            ai_provider: row.json_data.0.ai_provider.to_string(),
            ai_model: row.json_data.0.ai_model.to_string(),
            created_by_id: row.created_by_id,
            created_at: row.created_at.to_rfc3339(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct APIChatReply {
    id: i64,
    // Stored in Markdown
    message: String,
    chat_thread_id: i64,
    // User who posted this chat, including LLM
    created_by_id: i64,
    created_at: String,
    is_sent_to_ai: bool,
}

impl APIChatReply {
    pub fn from_sqlx_row(row: &ChatReplyRow) -> Self {
        Self {
            id: row.id,
            message: row.json_data.0.message.to_string(),
            chat_thread_id: row.chat_thread_id,
            created_by_id: row.created_by_id,
            created_at: row.created_at.to_rfc3339(),
            is_sent_to_ai: row.json_data.0.is_sent_to_ai,
        }
    }
}

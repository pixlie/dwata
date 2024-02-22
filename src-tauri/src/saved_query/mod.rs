use crate::query_result::DwataQuery;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct SavedQuery {
    id: u32,
    query: DwataQuery, // Stored as JSON
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SaveQueryChatMapping {
    id: u32,
    saved_query_id: u32,
    chat_id: u32,
}

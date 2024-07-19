use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::FromRow;
use ts_rs::TS;

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Label {
    pub id: i64,
    pub display_name: String,

    // Labels can be nested, so we need to store the parent ID
    pub parent_id: Option<i64>,

    // Is this label suggested by AI and not yet accepted by user?
    pub is_suggested: bool,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

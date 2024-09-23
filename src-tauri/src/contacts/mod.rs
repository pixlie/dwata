use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{types::Json, FromRow};
use ts_rs::TS;

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Contact {
    pub id: u32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,

    #[ts(type = "Array<string>")]
    pub email_address_list: Json<Vec<String>>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

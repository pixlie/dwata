use chrono::{DateTime, Utc};
use serde::Serialize;
use sqlx::{types::Json, FromRow};
use ts_rs::TS;

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Contact {
    pub id: i64,
    pub first_name: String,
    pub last_name: Option<String>,

    #[ts(as = "Vec<String>")]
    pub emails: Json<Vec<String>>,
    #[ts(as = "Vec<String>")]
    pub phone_numbers: Json<Vec<String>>,
    pub organization_id: Option<i64>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Organization {
    pub id: i64,
    pub name: String,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

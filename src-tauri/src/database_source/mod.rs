use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod configuration;
pub mod crud;
pub mod helpers;

#[derive(Debug, Deserialize, Serialize, Type, TS, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
#[ts(export)]
pub enum DatabaseType {
    PostgreSQL,
    MySQL,
    SQLite,
    MongoDB,
    Qdrant,
}

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct DatabaseSource {
    id: i64,
    pub label: Option<String>,
    pub database_type: DatabaseType,

    // An in memory database may not have a name
    pub database_name: Option<String>,

    // This can be path to file based or in memory databases
    pub path_to_local_database: Option<String>,

    // This is needed for TCP/IP based connections, including to localhost
    pub database_host: Option<String>,
    pub database_port: Option<u16>,
    // Authentication may not be needed for locally hosted databases
    pub database_username: Option<String>,
    pub database_password: Option<String>,
    // Some hosted databases require an API key for authentication
    pub database_api_key: Option<String>,

    // These are for connection over SSH
    pub ssh_host: Option<String>,
    pub ssh_port: Option<u16>,
    pub ssh_username: Option<String>,
    pub ssh_password: Option<String>,
    pub ssh_key_path: Option<String>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct DatabaseSourceCreateUpdate {
    pub label: Option<String>,
    pub database_type: Option<String>,
    pub database_name: Option<String>,
    pub database_host: Option<String>,
    pub database_port: Option<u16>,
    pub database_username: Option<String>,
    pub database_password: Option<String>,
}

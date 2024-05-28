mod configuration;
mod crud;

use serde::{Deserialize, Serialize};
use sqlx::{FromRow, Type};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, Type, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub enum DatabaseType {
    PostgreSQL,
    MySQL,
    SQLite,
    MSSQL,
    MongoDB,
    Qdrant,
}

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
#[ts(export, export_to = "../src/api_types/")]
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
    // If the user wants to prompt for the database password instead of storing it in Dwata
    // pub prompt_database_password: Option<bool>,
    pub database_password: Option<String>,
    pub database_api_key: Option<String>,

    // These are for connection over SSH
    // pub ssh_username: Option<String>,
    // If the user wants to prompt for the SSH password instead of storing it in Dwata
    // pub prompt_ssh_password: Option<bool>,
    // pub ssh_password: Option<String>,
    // pub ssh_key_path: Option<String>,
    // pub ssh_port: Option<u16>,
}

#[derive(Debug, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DatabaseSourceCreateUpdate {
    pub label: Option<String>,
    pub database_type: Option<String>,
    pub name: Option<String>,
    pub database_host: Option<String>,
    pub database_port: Option<u16>,
    pub database_username: Option<String>,
    pub database_password: Option<String>,
}

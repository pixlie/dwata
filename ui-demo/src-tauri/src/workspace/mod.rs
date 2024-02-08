use crate::schema::Database;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use url::Url;

#[derive(Debug, Deserialize, Serialize)]
pub struct Organisation {
    name: String,
    server_uri: Url,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MainConfig {
    organisations: Vec<Organisation>,
    database_list: Vec<Database>, // PostgreSQL, MySQL/MariaDB, SQLite3, MongoDB
    // api_list: Vec<>, // Stripe, Shopify, etc.
    folder_list: Vec<PathBuf>, // CSV or Markdown files
}

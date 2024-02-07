use crate::schema::Database;
use serde::{Deserialize, Serialize};
use url::Url;

#[derive(Debug, Deserialize, Serialize)]
pub struct Organisation {
    name: String,
    server_uri: Url,
    databases: Vec<Database>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MainConfig {
    organisations: Vec<Organisation>,
}

pub mod commands;

use crate::data_sources::DataSource;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

// #[derive(Debug, Deserialize, Serialize)]
// pub struct Organisation {
//     name: String,
//     server_uri: Url,
// }

#[derive(Debug, Deserialize, Serialize)]
pub struct Config {
    // organisations: Vec<Organisation>,
    data_source_list: Vec<DataSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    folder_list: Vec<PathBuf>, // CSV or Markdown files
}

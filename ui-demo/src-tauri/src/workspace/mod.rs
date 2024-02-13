use crate::data_sources::DataSource;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use url::Url;

// #[derive(Debug, Deserialize, Serialize)]
// pub struct Organisation {
//     name: String,
//     server_uri: Url,
// }

#[derive(Debug, Deserialize, Serialize)]
pub struct MainConfig {
    // organisations: Vec<Organisation>,
    data_source_list: Vec<DataSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    folder_list: Vec<PathBuf>, // CSV or Markdown files
}

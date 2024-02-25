use crate::data_sources::api_types::APIDataSource;
use crate::workspace::Config;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIConfig {
    data_source_list: Vec<APIDataSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    // folder_list: Vec<PathBuf>, // CSV or Markdown files
}

impl APIConfig {
    pub fn from_config(config: &Config) -> Self {
        Self {
            data_source_list: config
                .data_source_list
                .iter()
                .map(|x| x.get_api_data_source())
                .collect::<Vec<APIDataSource>>(),
        }
    }
}

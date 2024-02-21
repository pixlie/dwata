use ts_rs::TS;

pub mod commands;
pub mod helpers;

use crate::data_sources::DataSource;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

// #[derive(Debug, Deserialize, Serialize)]
// pub struct Organisation {
//     name: String,
//     server_uri: Url,
// }

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Config {
    // organisations: Vec<Organisation>,
    data_source_list: Vec<DataSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    #[ts(skip)]
    folder_list: Vec<PathBuf>, // CSV or Markdown files
}

impl Config {
    pub fn get_data_source(&self, data_source_id: &str) -> Option<&DataSource> {
        match self
            .data_source_list
            .iter()
            .find(|x| x.get_id() == data_source_id)
        {
            Some(x) => Some(x),
            None => None,
        }
    }
}

use ts_rs::TS;

pub mod api_types;
pub mod commands;
pub mod helpers;

use crate::data_sources::DataSource;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Deserialize, Serialize)]
pub struct Config {
    path_to_config: PathBuf,
    // organisations: Vec<Organisation>,
    data_source_list: Vec<DataSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    folder_list: Vec<PathBuf>, // CSV or Markdown files
}

impl Config {
    pub fn get_data_source(&self, data_source_id: &str) -> Option<&DataSource> {
        self.data_source_list
            .iter()
            .find(|x| x.get_id() == data_source_id)
    }

    pub fn get_pretty_string(&self) -> String {
        ron::ser::to_string_pretty(&self, ron::ser::PrettyConfig::default()).unwrap()
    }
}

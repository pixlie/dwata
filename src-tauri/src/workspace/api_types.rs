use crate::ai::api_types::APIAIIntegration;
use crate::data_sources::api_types::APIDataSource;
use crate::workspace::Config;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIConfig {
    data_source_list: Vec<APIDataSource>,
    ai_integration_list: Vec<APIAIIntegration>,
}

impl APIConfig {
    pub fn from_config(config: &Config) -> Self {
        Self {
            data_source_list: config
                .data_source_list
                .iter()
                .map(|x| x.get_api_data_source())
                .collect::<Vec<APIDataSource>>(),
            ai_integration_list: config
                .ai_integration_list
                .iter()
                .map(|x| x.get_api_ai_integration())
                .collect(),
        }
    }
}

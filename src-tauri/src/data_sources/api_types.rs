use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIDataSource {
    id: String,
    label: Option<String>,
    source_type: String,
    source_name: String,
}

impl APIDataSource {
    pub fn new(
        id: String,
        label: Option<String>,
        source_type: String,
        source_name: String,
    ) -> Self {
        Self {
            id,
            label,
            source_type,
            source_name,
        }
    }
}

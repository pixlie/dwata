use derive_builder::Builder;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Clone, Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum APIQueryOrder {
    Asc,
    Desc,
}

#[derive(Clone, Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIGridQuery {
    source: String,
    schema: Option<String>,
    table: Option<String>,
    // Columns only from one logical table, not merging should be needed
    columns: Vec<String>,
    ordering: Option<HashMap<u8, APIQueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

impl APIGridQuery {
    pub fn get_source_name(&self) -> String {
        self.source.clone()
    }

    pub fn get_columns(&self) -> Vec<String> {
        self.columns.clone()
    }

    pub fn get_schema_and_table_names(
        &self,
        default_schema_name: Option<String>,
    ) -> (String, String) {
        (
            self.schema
                .clone()
                .unwrap_or_else(|| default_schema_name.unwrap_or_else(|| "public".to_string())),
            self.table.clone().unwrap(),
        )
    }
}

#[derive(Debug, Deserialize, Serialize, Builder)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct APIGridData {
    source: String,
    schema: Option<String>,
    table: Option<String>,
    rows: Vec<Vec<serde_json::Value>>,
}

use crate::query_result::SelectColumnsPath;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum APIQueryOrder {
    Asc,
    Desc,
}

#[derive(Debug, Clone, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APISelectColumnsPath {
    source: String,
    schema: Option<String>,
    table: Option<String>,
    // Columns only from one logical table, not merging should be needed
    columns: Vec<String>,
    ordering: Option<HashMap<u8, APIQueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

#[derive(Debug, Clone, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIDwataQuery {
    select: Vec<APISelectColumnsPath>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIDwataData {
    columns: Vec<APISelectColumnsPath>,
    rows_of_columns: Vec<Vec<String>>,
}

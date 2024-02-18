use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub mod commands;
mod postgresql;

use std::collections::HashMap;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ColumnPath {
    column_name: String,
    table_name: String,
    data_source_id: String,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum QueryOrder {
    Asc,
    Desc,
}

#[derive(Debug, Default, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Query {
    select: Vec<ColumnPath>,
    ordering: Option<HashMap<u8, QueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Data {
    columns: Vec<ColumnPath>,
    rows: Vec<Vec<String>>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct QueryAndData {
    query: Query,
    data: Data,
    errors: Vec<String>,
}

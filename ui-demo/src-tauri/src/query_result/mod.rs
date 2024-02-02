pub mod commands;

use std::collections::HashMap;

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct ColumnSpec(String, String, String);

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum QueryOrder {
    Asc,
    Desc,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Query {
    source: String,
    select: Vec<ColumnSpec>,
    ordering: Option<HashMap<u8, QueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct QueryResultData {
    columns: Vec<ColumnSpec>,
    rows: Vec<Vec<String>>,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct QueryResult {
    data: QueryResultData,
    errors: Vec<String>,
}

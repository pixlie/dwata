use serde::{Deserialize, Serialize};

pub mod commands;

use std::collections::HashMap;

#[derive(Debug, Deserialize, Serialize)]
pub struct ColumnSpec(String, String, String);

#[derive(Debug, Deserialize, Serialize)]
pub enum QueryOrder {
    Asc,
    Desc,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Query {
    source: String,
    select: Vec<ColumnSpec>,
    ordering: Option<HashMap<u8, QueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct QueryResultData {
    columns: Vec<ColumnSpec>,
    rows: Vec<Vec<String>>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct QueryResult {
    data: QueryResultData,
    errors: Vec<String>,
}

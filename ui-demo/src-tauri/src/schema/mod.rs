use std::collections::HashMap;

pub mod commands;

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Column {
    name: String,
    label: Option<String>,
    is_primary_key: bool,
    is_auto_increment: bool,
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Schema {
    sources: Vec<String>,
    tables: HashMap<String, Vec<String>>,
    columns: HashMap<String, HashMap<String, Vec<Column>>>,
}

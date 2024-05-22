use crate::content::form::FormField;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(
    export,
    rename = "Configuration",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Configuration {
    pub name: String,
    pub description: String,
    pub fields: Vec<FormField>,
}

impl Configuration {
    pub fn new(name: &str, desctiption: &str, fields: Vec<FormField>) -> Self {
        Configuration {
            name: name.to_string(),
            description: desctiption.to_string(),
            fields,
        }
    }
}

pub trait Configurable {
    fn get_schema() -> Configuration;
}

use crate::content::form::FormField;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(
    export,
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Configuration {
    pub title: String,
    pub description: String,
    pub fields: Vec<FormField>,
}

impl Configuration {
    pub fn new(title: &str, description: &str, fields: Vec<FormField>) -> Self {
        Configuration {
            title: title.to_string(),
            description: description.to_string(),
            fields,
        }
    }
}

pub trait Configurable {
    fn get_schema() -> Configuration;
}

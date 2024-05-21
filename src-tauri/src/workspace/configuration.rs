use crate::content::form::{FormData, FormField};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(
    export,
    rename = "ConfigurationSchema",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct ConfigurationSchema {
    pub name: String,
    pub description: String,
    pub fields: Vec<FormField>,
}

impl ConfigurationSchema {
    pub fn new(name: &str, desctiption: &str, fields: Vec<FormField>) -> Self {
        ConfigurationSchema {
            name: name.to_string(),
            description: desctiption.to_string(),
            fields,
        }
    }
}

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(
    export,
    rename = "ConfigurationData",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct ConfigurationData {
    pub id: Option<String>,
    pub data: FormData,
}

pub trait Configurable {
    fn get_schema() -> ConfigurationSchema;
}

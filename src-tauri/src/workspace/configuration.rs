use crate::content::form::FormField;
use crate::relational_database::crud::FormData;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
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

// pub trait ManageConfiguration {
// async fn get_single_configuration(
//     id: i64,
//     db_connection: &mut SqliteConnection,
// ) -> Result<Self::Model, DwataError>;

// async fn list_configurations(
//     db_connection: &mut SqliteConnection,
// ) -> Result<ConfigurationData, DwataError>;

// async fn update_configuration(
//     id: i64,
//     data: ConfigurationData,
//     db_connection: &mut SqliteConnection,
// ) -> Result<bool, DwataError>;
// }

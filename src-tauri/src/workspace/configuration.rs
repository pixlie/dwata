use crate::content::form::FormField;
use crate::content::form::FormFieldData;
use crate::error::DwataError;
use serde::{Deserialize, Serialize};
use sqlx::SqliteConnection;
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

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "ConfigurationData",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct ConfigurationData {
    pub id: Option<String>,
    pub data: Vec<FormFieldData>,
}

pub trait Configuration {
    type Model;
    type PrimaryKey;

    fn get_schema() -> ConfigurationSchema;

    async fn get_single_configuration(
        id: Self::PrimaryKey,
        db_connection: &mut SqliteConnection,
    ) -> Result<Self::Model, DwataError>;

    async fn list_configurations(
        db_connection: &mut SqliteConnection,
    ) -> Result<ConfigurationData, DwataError>;

    async fn create_configuration(
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<String, DwataError>;

    async fn update_configuration(
        id: &str,
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<bool, DwataError>;
}

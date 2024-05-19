use super::models::Directory;
use crate::content::content_types::ContentType;
use crate::content::form::FormField;
use crate::error::DwataError;
use crate::workspace::configuration::{Configuration, ConfigurationData, ConfigurationSchema};
use sqlx::SqliteConnection;
use std::collections::HashSet;

impl Configuration for Directory {
    type Model = Directory;

    fn get_schema() -> ConfigurationSchema {
        ConfigurationSchema::new(
            "Directory",
            "Directory containing files which match specified types",
            vec![
                FormField::new(
                    "path",
                    "Path to Directory",
                    Some(
                        "The directory from which you want to read files matching specified types",
                    ),
                    (ContentType::Text, HashSet::new()),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "label",
                    "Label",
                    Some("An easy to remember label for this directory"),
                    (ContentType::Text, HashSet::new()),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "include_patters",
                    "Include patterns",
                    Some("File glob patterns to include (like in .gitignore file)"),
                    (ContentType::Text, HashSet::new()),
                    Some(true),
                    Some(true),
                ),
            ],
        )
    }

    async fn list_configurations(
        db_connection: &mut SqliteConnection,
    ) -> Result<Directory, DwataError> {
    }

    async fn create_configuration(
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<i64, DwataError> {
    }

    async fn update_configuration(
        id: &str,
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<bool, DwataError> {
    }
}

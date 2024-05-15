use super::models::Directory;
use crate::content::content_types::ContentType;
use crate::content::form::FormField;
use crate::error::DwataError;
use crate::workspace::configuration::{Configuration, ConfigurationData, ConfigurationSchema};
use sqlx::SqliteConnection;
use std::collections::HashSet;

impl Configuration for Directory {
    type Model = Directory;
    type PrimaryKey = i64;

    fn get_schema() -> ConfigurationSchema {
        ConfigurationSchema {
            name: "Directory".to_string(),
            description: "Directory containing files which match specified types".to_string(),
            fields: vec![
                FormField {
                    name: "path".to_string(),
                    label: "Path to Directory".to_string(),
                    description: Some(
                        "The directory from which you want to read files matching specified types"
                            .to_string(),
                    ),
                    field: (ContentType::Text, HashSet::new()),
                    is_required: Some(true),
                    is_editable: Some(true),
                },
                FormField {
                    name: "label".to_string(),
                    label: "Label".to_string(),
                    description: Some("An easy to remember label for this directory".to_string()),
                    field: (ContentType::Text, HashSet::new()),
                    is_required: Some(false),
                    is_editable: Some(true),
                },
                FormField {
                    name: "include_patters".to_string(),
                    label: "Include patterns".to_string(),
                    description: Some(
                        "File glob patterns to include (like in .gitignore file)".to_string(),
                    ),
                    field: (ContentType::Text, HashSet::new()),
                    is_required: Some(true),
                    is_editable: Some(true),
                },
            ],
        }
    }

    async fn list_configurations(
        db_connection: &mut SqliteConnection,
    ) -> Result<Self::Model, DwataError> {
    }

    async fn create_configuration(
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<String, DwataError> {
    }

    async fn update_configuration(
        id: &str,
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<bool, DwataError> {
    }
}

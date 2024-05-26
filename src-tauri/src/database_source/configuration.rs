use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::database_source::DatabaseSource;
use crate::workspace::configuration::{Configurable, Configuration};

impl Configurable for DatabaseSource {
    fn get_schema() -> Configuration {
        let database_type_content_spec: ContentSpec = ContentSpec {
            text_type: None,
            length_limits: None,
            choices_with_string_keys: Some(vec![
                ("PostgreSQL".to_string(), "PostgreSQL".to_string()),
                ("MySQL".to_string(), "MySQL".to_string()),
                ("SQLite".to_string(), "SQLite".to_string()),
            ]),
            is_prompt: None,
        };

        Configuration::new(
            "Database Source",
            "Database source details",
            vec![
                FormField::new(
                    "label",
                    "Label",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "database_type",
                    "Database type",
                    None,
                    ContentType::SingleChoice,
                    database_type_content_spec,
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "database_host",
                    "Database host",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "database_port",
                    "Database port",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "database_name",
                    "Database name",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "database_username",
                    "Database username",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "database_password",
                    "Database password",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
            ],
        )
    }
}

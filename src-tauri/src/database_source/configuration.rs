use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::database_source::DatabaseSource;
use crate::workspace::configuration::{Configurable, Configuration};

impl Configurable for DatabaseSource {
    fn get_schema() -> Configuration {
        let database_type_content_spec: ContentSpec = ContentSpec {
            choices: Some(vec![
                ("PostgreSQL".to_string(), "PostgreSQL".to_string()),
                ("MySQL".to_string(), "MySQL".to_string()),
                ("SQLite".to_string(), "SQLite".to_string()),
            ]),
            ..ContentSpec::default()
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
                    "databaseType",
                    "Database type",
                    None,
                    ContentType::SingleChoice,
                    database_type_content_spec,
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "databaseName",
                    "Database name",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "databaseHost",
                    "Database host",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "databasePort",
                    "Database port",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "databaseUsername",
                    "Database username",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "databasePassword",
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

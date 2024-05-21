use super::UserAccount;
use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::workspace::configuration::{Configurable, ConfigurationSchema};

impl Configurable for UserAccount {
    fn get_schema() -> ConfigurationSchema {
        ConfigurationSchema::new(
            "User Account",
            "User account details",
            vec![
                FormField::new(
                    "first_name",
                    "First Name",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "last_name",
                    "Last Name",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "email",
                    "Email",
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

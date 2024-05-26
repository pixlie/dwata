use super::UserAccount;
use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::workspace::configuration::{Configurable, Configuration};

impl Configurable for UserAccount {
    fn get_schema() -> Configuration {
        Configuration::new(
            "User Account",
            "User account details",
            vec![
                FormField::new(
                    "firstName",
                    "First Name",
                    None,
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "lastName",
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

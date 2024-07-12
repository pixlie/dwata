use super::UserAccount;
use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::error::DwataError;
use crate::workspace::api::{Configuration, NextStep, Writable};

impl Writable for UserAccount {
    fn initiate() -> Result<NextStep, DwataError> {
        Ok(NextStep::Configure(Configuration::new(
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
        )))
    }
}

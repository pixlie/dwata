use std::str::FromStr;

use super::{EmailAccount, EmailProvider};
use crate::content::content::{ContentSpec, ContentType, TextType};
use crate::content::form::FormField;
use crate::error::DwataError;
use crate::workspace::api::{Configuration, NextStep, Writable};
use crate::workspace::crud::ModuleDataCreateUpdate;

impl EmailAccount {
    fn get_initial_form_fields() -> Vec<FormField> {
        let provider_spec: ContentSpec = ContentSpec {
            choices: Some(vec![
                (EmailProvider::Gmail.to_string(), "Gmail".to_string()),
                (
                    EmailProvider::ProtonMail.to_string(),
                    "ProtonMail".to_string(),
                ),
            ]),
            ..ContentSpec::default()
        };

        vec![FormField {
            name: "provider".to_string(),
            label: Some("Provider".to_string()),
            content_type: ContentType::SingleChoice,
            content_spec: provider_spec,
            ..Default::default()
        }]
    }

    fn get_initial_configuration() -> Configuration {
        Configuration::new(
            "Email account",
            "dwata uses IMAP to read your email inbox. Gmail needs OAuth2 credentials and Protonmail needs email address and password with Proton Mail Bridge.",
            Self::get_initial_form_fields(),
        )
    }
}

impl Writable for EmailAccount {
    fn initiate() -> Result<NextStep, DwataError> {
        Ok(NextStep::Configure(Self::get_initial_configuration()))
    }

    async fn on_change(data: ModuleDataCreateUpdate) -> Result<NextStep, DwataError> {
        match data {
            ModuleDataCreateUpdate::EmailAccount(x) => {
                // Check if the provider is set
                if x.provider.is_none() || x.provider == Some("".to_string()) {
                    return Ok(NextStep::Continue);
                }
                let provider = match EmailProvider::from_str(&x.provider.as_ref().unwrap()) {
                    Ok(x) => x,
                    Err(_) => return Err(DwataError::InvalidEmailProvider),
                };

                let mut fields = Self::get_initial_form_fields();
                match provider {
                    EmailProvider::Gmail => {
                        // If provider is Gmail, then show OAuth2 choice list
                        fields.push(FormField {
                            name: "oauth2Id".to_string(),
                            label: Some("Select OAuth2 credentials".to_string()),
                            content_type: ContentType::SingleChoice,
                            content_spec: ContentSpec {
                                choices_from_function: Some("get_oauth2_choice_list".to_string()),
                                ..ContentSpec::default()
                            },
                            ..Default::default()
                        });
                    }
                    EmailProvider::ProtonMail => {
                        fields.push(FormField {
                            name: "emailAddress".to_string(),
                            label: Some("Email address".to_string()),
                            content_spec: ContentSpec {
                                text_type: Some(TextType::Email),
                                ..ContentSpec::default()
                            },
                            ..Default::default()
                        });
                        fields.push(FormField {
                            name: "password".to_string(),
                            label: Some("Password".to_string()),
                            content_spec: ContentSpec {
                                text_type: Some(TextType::Password),
                                ..ContentSpec::default()
                            },
                            ..Default::default()
                        });
                    }
                }
                return Ok(NextStep::Configure(Configuration::new(
                    "Email Account",
                    "Email account details",
                    fields,
                )));
            }
            _ => Err(DwataError::NextStepNotAvailable),
        }
    }
}

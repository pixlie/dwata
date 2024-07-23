use log::info;

use super::helpers::get_google_oauth2_authorize_url;
use super::{OAuth2App, OAuth2Provider};
use crate::content::content::{Content, TextType};
use crate::content::form::{FormButton, FormButtonType};
use crate::content::{
    content::{ContentSpec, ContentType},
    form::FormField,
};
use crate::error::DwataError;
use crate::workspace::api::{Configuration, NextStep, Writable};
use crate::workspace::crud::ModuleDataCreateUpdate;

impl OAuth2App {
    fn get_initial_form_fields() -> Vec<FormField> {
        let provider_spec: ContentSpec = ContentSpec {
            choices: Some(vec![(
                OAuth2Provider::Google.to_string(),
                "Google".to_string(),
            )]),
            ..ContentSpec::default()
        };

        vec![
            FormField {
                name: "provider".to_string(),
                label: Some("Provider".to_string()),
                content_type: ContentType::SingleChoice,
                content_spec: provider_spec,
                default_value: Some(Content::Text("google".to_string())),
                ..Default::default()
            },
            FormField::text_field("clientId", "Client ID"),
            FormField::text_field("clientSecret", "Client Secret"),
        ]
    }

    fn get_initial_configuration() -> Configuration {
        Configuration {
            title: "OAuth2 credentials".to_string(),
            description: "OAuth2 credentials for third party services".to_string(),
            fields: Self::get_initial_form_fields(),
            buttons: vec![FormButton {
                button_type: Some(FormButtonType::Submit),
                label: "Proceed to authorization".to_string(),
            }],
            submit_implicitly: false,
        }
    }
}

impl Writable for OAuth2App {
    fn initiate() -> Result<NextStep, DwataError> {
        Ok(NextStep::Configure(Self::get_initial_configuration()))
    }

    async fn next_step(data: ModuleDataCreateUpdate) -> Result<NextStep, DwataError> {
        match data {
            ModuleDataCreateUpdate::OAuth2(x) => {
                // Add the Google authorization URL as a field
                if x.client_id.is_none()
                    || x.client_id == Some("".to_string())
                    || x.client_secret.is_none()
                    || x.client_secret == Some("".to_string())
                {
                    return Ok(NextStep::Continue);
                }

                let authorize_url = get_google_oauth2_authorize_url(
                    x.client_id.as_ref().unwrap().clone(),
                    x.client_secret.as_ref().unwrap().clone(),
                )
                .await?;

                Ok(NextStep::Configure(
                    Configuration {
                        title: "OAuth2 credentials".to_string(),
                        description: "Waiting for your authorization at the URL".to_string(),
                        fields: vec![FormField {
                            name: "googleAuthLink".to_string(),
                            label: Some("Link to authorize".to_string()),
                            description: Some("Please copy this link to your browser and authorize data access with Google".to_string()),
                            content_spec: ContentSpec {
                                text_type: Some(TextType::Link),
                                ..Default::default()
                            },
                            default_value: Some(Content::Text(authorize_url)),
                            is_required: Some(false),
                            is_editable: Some(false),
                            ..Default::default()
                        }],
                        buttons: vec![],
                        submit_implicitly: true
                    })
                )
            }
            _ => Err(DwataError::NextStepNotAvailable),
        }
    }
}

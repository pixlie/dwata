use crate::content::{
    content::{ContentSpec, ContentType},
    form::FormField,
};
use crate::workspace::configuration::{Configurable, Configuration};

use super::AIIntegration;

impl Configurable for AIIntegration {
    fn get_schema() -> Configuration {
        let ai_provider_spec: ContentSpec = ContentSpec {
            text_type: None,
            length_limits: None,
            choices_with_string_keys: Some(vec![
                ("openai".to_string(), "OpenAI".to_string()),
                ("groq".to_string(), "Groq".to_string()),
                ("anthropic".to_string(), "Anthropic".to_string()),
            ]),
            is_prompt: None,
        };

        Configuration::new(
            "AI Integration",
            "API key based integration to an AI providers with your own API key.
            You can have more than one integration to the same provider.",
            vec![
                FormField::new(
                    "ai_provider",
                    "Select AI provider",
                    None,
                    ContentType::SingleChoice,
                    ai_provider_spec,
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "display_label",
                    "Label",
                    Some("An easy to remember label for this AI integration"),
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "api_key",
                    "API key",
                    Some("You will find this in your AI providers account settings"),
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
            ],
        )
    }
}

use crate::content::{
    content::{ContentSpec, ContentType},
    form::FormField,
};
use crate::workspace::configuration::{Configurable, Configuration};

use super::{AIIntegration, AIProvider};

impl Configurable for AIIntegration {
    fn get_schema() -> Configuration {
        let ai_provider_spec: ContentSpec = ContentSpec {
            choices: Some(vec![
                (AIProvider::OpenAI.to_string(), "OpenAI".to_string()),
                (AIProvider::Groq.to_string(), "Groq".to_string()),
                (AIProvider::Ollama.to_string(), "Ollama".to_string()),
            ]),
            ..ContentSpec::default()
        };

        Configuration::new(
            "AI Integration",
            "API key based integration to an AI providers with your own API key.
            You can have more than one integration to the same provider.",
            vec![
                FormField::new(
                    "label",
                    "Label",
                    Some("An easy to remember label for this AI integration"),
                    ContentType::Text,
                    ContentSpec::default(),
                    Some(false),
                    Some(true),
                ),
                FormField::new(
                    "aiProvider",
                    "Select AI provider",
                    None,
                    ContentType::SingleChoice,
                    ai_provider_spec,
                    Some(true),
                    Some(true),
                ),
                FormField::new(
                    "apiKey",
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

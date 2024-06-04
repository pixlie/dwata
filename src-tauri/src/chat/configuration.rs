use crate::chat::Chat;
use crate::content::content::{ContentSpec, ContentType};
use crate::content::form::FormField;
use crate::workspace::configuration::{Configurable, Configuration};

impl Configurable for Chat {
    fn get_schema() -> Configuration {
        Configuration::new(
            "Chat",
            "A chat with AI models or other users in your team where replies can come from AI models, or other users.",
            vec![
                FormField::new(
                    "message",
                    "Message",
                    Some("What do you want to have a chat about? Try to keep the message short.\
                    If you have a broad task then it is better to break it into tasks in your chat."),
                    ContentType::Text,
                    ContentSpec {choices_from_function: Some("get_list_of_ai_models".to_string()), ..ContentSpec::default()},
                    Some(true),
                    Some(true)
                ),
                FormField::new(
                    "requestedAiModelId",
                    "AI Model",
                    Some("What AI model would you like to use?"),
                    ContentType::SingleChoice,
                    ContentSpec::default(),
                    Some(true),
                    Some(true)
                ),
            ]
        )
    }
}

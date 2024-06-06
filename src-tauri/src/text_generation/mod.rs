use crate::{
    ai_integration::{
        models::AIModel,
        providers::openai::{ChatRequestMessage, OpenAIChatRequest},
        AIIntegration, AIProvider,
    },
    error::DwataError,
};
use log::info;
use reqwest::RequestBuilder;

pub mod commands;
pub mod helpers;

impl AIIntegration {
    // Chat related
    pub fn get_text_generation_url(&self) -> Option<String> {
        match self.ai_provider {
            AIProvider::OpenAI => Some("https://api.openai.com/v1/chat/completions".to_string()),
            AIProvider::Groq => Some("https://api.groq.com/openai/v1/chat/completions".to_string()),
            AIProvider::Ollama => Some("http://localhost:11434/api/chat".to_string()),
            // AIProvider::Anthropic => Some("https://api.anthropic.com/v1/messages".to_string()),
            // AIProvider::MistralAI => Some("https://api.mistral.ai/v1/chat/completions".to_string()),
        }
    }

    pub fn build_text_generation_https_request(
        &self,
        ai_model: AIModel,
        message_to_send: String,
    ) -> Result<RequestBuilder, DwataError> {
        let chat_url = self.get_text_generation_url();
        if chat_url.is_none() {
            return Err(DwataError::FeatureNotAvailableWithAIProvider);
        }
        let https_client = reqwest::Client::new();
        let payload: OpenAIChatRequest = OpenAIChatRequest {
            model: ai_model.api_name,
            messages: vec![ChatRequestMessage {
                role: "user".to_string(),
                content: message_to_send,
            }],
            tools: vec![],
        };
        let request_builder: RequestBuilder = https_client
            .post(chat_url.unwrap())
            .header(
                "Authorization",
                format!("Bearer {}", self.api_key.as_ref().unwrap()),
            )
            .json(&payload);
        info!("{}", serde_json::to_string_pretty(&payload).unwrap());
        Ok(request_builder)
    }
}

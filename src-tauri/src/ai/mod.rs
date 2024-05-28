use crate::ai::providers::openai::{ChatRequestMessage, OpenAIChatRequest};
use crate::error::DwataError;
use chrono::{DateTime, Utc};
use reqwest::RequestBuilder;
use serde::{Deserialize, Serialize};
use sqlx::prelude::{FromRow, Type};
use ts_rs::TS;
use url::Url;

// pub mod api_types;
// pub mod commands;
// pub mod helpers;
pub mod configuration;
pub mod crud;
pub mod providers;

#[derive(Debug, Deserialize, Serialize, Clone, TS, Type)]
#[ts(export, export_to = "../src/api_types/")]
pub enum AIProvider {
    OpenAI,
    Groq,
    Anthropic,
}

impl AIProvider {
    // Chat related
    pub fn get_chat_url(&self) -> Option<String> {
        match self {
            Self::OpenAI => Some("https://api.openai.com/v1/chat/completions".to_string()),
            Self::Groq => Some("https://api.groq.com/openai/v1/chat/completions".to_string()),
            Self::Anthropic => Some("https://api.anthropic.com/v1/messages".to_string()),
        }
    }

    pub fn build_chat_https_request(
        &self,
        api_key: String,
        ai_model: String,
        message_to_send: String,
    ) -> Result<RequestBuilder, DwataError> {
        let chat_url = self.get_chat_url();
        if chat_url.is_none() {
            return Err(DwataError::FeatureNotAvailableWithAIProvider);
        }
        let https_client = reqwest::Client::new();
        let payload: OpenAIChatRequest = OpenAIChatRequest {
            model: ai_model,
            messages: vec![ChatRequestMessage {
                role: "user".to_string(),
                content: message_to_send,
            }],
            tools: vec![],
        };
        let request_builder = https_client
            .post(chat_url.unwrap())
            .header("Authorization", format!("Bearer {}", api_key))
            .json::<OpenAIChatRequest>(&payload);
        println!("{}", serde_json::to_string_pretty(&payload).unwrap());
        Ok(request_builder)
    }
}

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct AIIntegration {
    pub id: i64,
    pub label: Option<String>,
    pub ai_provider: AIProvider,
    pub api_key: Option<String>,

    // In case of a self-hosted AI provider
    pub endpoint_url: Option<String>,

    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct AIIntegrationCreateUpdate {
    pub label: Option<String>,
    pub ai_provider: Option<String>,
    pub api_key: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct AIModel {
    id: i64,
    ai_provider: AIProvider,
    label: String,
    api_name: String,
    latest_version_api_name: Option<String>,
    context_window: Option<i32>,
    // Prices are in US cents
    price_per_million_input_tokens: Option<i32>,
    price_per_million_output_tokens: Option<i32>,
    link_to_model_documentation: Option<Url>,
}

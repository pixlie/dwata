use crate::ai::providers::openai::{ChatRequestMessage, OpenAIChatRequest};
use crate::error::DwataError;
use chrono::{DateTime, Utc};
use log::info;
use reqwest::RequestBuilder;
use serde::{Deserialize, Serialize};
use sqlx::prelude::{FromRow, Type};
use ts_rs::TS;

// pub mod helpers;
pub mod configuration;
pub mod crud;
pub mod models;
pub mod providers;

#[derive(Debug, Deserialize, Serialize, Clone, TS, Type)]
#[sqlx(rename_all = "lowercase")]
#[ts(export, export_to = "../src/api_types/")]
pub enum AIProvider {
    OpenAI,
    Groq,
    // Anthropic,
    // Ollama,
    // Mistral,
}

impl TryFrom<String> for AIProvider {
    type Error = DwataError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "openai" => Ok(Self::OpenAI),
            "groq" => Ok(Self::Groq),
            // "anthropic" => Ok(Self::Anthropic),
            // "ollama" => Ok(Self::Ollama),
            // "mistral" => Ok(Self::Mistral),
            _ => Err(DwataError::InvalidAIProvider),
        }
    }
}

impl From<AIProvider> for String {
    fn from(value: AIProvider) -> Self {
        match value {
            AIProvider::OpenAI => "openai".to_string(),
            AIProvider::Groq => "groq".to_string(),
            // AIProvider::Anthropic => "anthropic".to_string(),
            // AIProvider::Ollama => "ollama".to_string(),
            // AIProvider::Mistral => "mistral".to_string(),
        }
    }
}

impl AIProvider {
    // Chat related
    pub fn get_chat_url(&self) -> Option<String> {
        match self {
            Self::OpenAI => Some("https://api.openai.com/v1/chat/completions".to_string()),
            Self::Groq => Some("https://api.groq.com/openai/v1/chat/completions".to_string()),
            // Self::Anthropic => Some("https://api.anthropic.com/v1/messages".to_string()),
            // Self::Ollama => Some("http://localhost:11434/api/chat".to_string()),
            // Self::MistralAI => Some("https://api.mistral.ai/v1/chat/completions".to_string()),
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
        info!("{}", serde_json::to_string_pretty(&payload).unwrap());
        Ok(request_builder)
    }
}

#[derive(Debug, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct AIIntegration {
    pub id: i64,
    pub label: Option<String>,
    pub ai_provider: AIProvider,
    pub api_key: Option<String>,

    // In case of a self-hosted AI provider
    pub endpoint_url: Option<String>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct AIIntegrationCreateUpdate {
    pub label: Option<String>,
    pub ai_provider: Option<String>,
    pub api_key: Option<String>,
}

use crate::error::DwataError;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::{FromRow, Type};
use ts_rs::TS;

pub mod commands;
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
    Ollama,
    // Anthropic,
    // Mistral,
}

impl TryFrom<String> for AIProvider {
    type Error = DwataError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "openai" => Ok(Self::OpenAI),
            "groq" => Ok(Self::Groq),
            "ollama" => Ok(Self::Ollama),
            // "anthropic" => Ok(Self::Anthropic),
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
            AIProvider::Ollama => "ollama".to_string(),
            // AIProvider::Anthropic => "anthropic".to_string(),
            // AIProvider::Mistral => "mistral".to_string(),
        }
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
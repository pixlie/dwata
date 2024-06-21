use crate::error::DwataError;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::{FromRow, Type};
use std::{path::Display, str::FromStr};
use ts_rs::TS;

pub mod commands;
pub mod configuration;
pub mod crud;
pub mod models;
pub mod providers;

#[derive(Debug, Default, Deserialize, Serialize, Clone, TS, Type)]
#[sqlx(rename_all = "lowercase")]
#[ts(export)]
pub enum AIProvider {
    OpenAI,
    Groq,
    #[default]
    Ollama,
    // Anthropic,
    // Mistral,
}

impl FromStr for AIProvider {
    type Err = DwataError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "openai" => Ok(Self::OpenAI),
            "groq" => Ok(Self::Groq),
            "ollama" => Ok(Self::Ollama),
            // "anthropic" => Ok(Self::Anthropic),
            // "mistral" => Ok(Self::Mistral),
            _ => Err(DwataError::InvalidAIProvider),
        }
    }
}

impl ToString for AIProvider {
    fn to_string(&self) -> String {
        match self {
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
#[ts(export, rename_all = "camelCase")]
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
#[ts(export, rename_all = "camelCase")]
pub struct AIIntegrationCreateUpdate {
    pub label: Option<String>,
    pub ai_provider: Option<String>,
    pub api_key: Option<String>,
}

#[derive(Clone, Default, Debug, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct AIIntegrationFilters {
    #[ts(type = "number")]
    pub id: Option<i64>,
    pub ai_provider: Option<String>,
}

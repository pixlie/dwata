use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::prelude::{FromRow, Type};
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod api;
pub mod commands;
pub mod crud;
pub mod models;
pub mod providers;

#[derive(Debug, Default, Deserialize, Serialize, Clone, TS, Type, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
#[ts(export)]
pub enum AIProvider {
    OpenAI,
    Groq,
    #[default]
    Ollama,
    // Anthropic,
    // Mistral,
}

#[derive(Debug, Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct AIIntegration {
    #[ts(type = "number")]
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

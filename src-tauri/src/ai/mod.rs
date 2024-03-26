use crate::ai::api_types::APIAIIntegration;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ulid::Ulid;

pub(crate) mod api_types;
pub mod commands;
pub mod helpers;
pub mod providers;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct HttpsApi {
    api_key: String,
}

impl HttpsApi {
    pub fn new(api_key: &str) -> Self {
        Self {
            api_key: api_key.to_string(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub(crate) enum AiProvider {
    OpenAI(HttpsApi),
    Groq(HttpsApi),
}

impl AiProvider {
    pub fn new(ai_provider: &str, api_key: &str) -> Self {
        match ai_provider {
            "OpenAI" => Self::OpenAI(HttpsApi::new(api_key)),
            "Groq" => Self::Groq(HttpsApi::new(api_key)),
            _ => Self::OpenAI(HttpsApi::new(api_key)),
        }
    }

    pub fn get_name(&self) -> String {
        match self {
            Self::OpenAI(_) => "OpenAI".to_string(),
            Self::Groq(_) => "Groq".to_string(),
        }
    }

    pub fn get_api_key(&self) -> String {
        match self {
            Self::OpenAI(api) => api.api_key.clone(),
            Self::Groq(api) => api.api_key.clone(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub(crate) struct AiIntegration {
    id: String,
    ai_provider: AiProvider,
    display_label: Option<String>,
}

impl AiIntegration {
    pub fn new(ai_provider: &str, api_key: &str, display_label: Option<&str>) -> Self {
        Self {
            id: Ulid::new().to_string(),
            ai_provider: AiProvider::new(ai_provider, api_key),
            display_label: display_label.map(|x| x.to_string()),
        }
    }

    pub fn get_id(&self) -> String {
        self.id.clone()
    }

    pub fn get_api_ai_integration(&self) -> APIAIIntegration {
        APIAIIntegration::new(
            self.get_id(),
            self.ai_provider.get_name(),
            Some(self.ai_provider.get_api_key()),
            self.display_label.clone(),
        )
    }

    pub fn match_by_id(&self, id: &str) -> bool {
        self.id == id
    }
}

pub(crate) struct AiModel {
    api_name: String,
    label: String,
    context_window: Option<usize>,
}

pub(crate) fn get_ai_models() -> HashMap<String, Vec<AiModel>> {
    let mut models = HashMap::new();
    models.insert(
        "OpenAI".to_string(),
        vec![
            AiModel {
                api_name: "gpt-4-turbo-preview".to_string(),
                label: "GPT-4 Turbo".to_string(),
                context_window: Some(128_000),
            },
            AiModel {
                api_name: "gpt-3.5-turbo".to_string(),
                label: "GPT-3.5 Turbo".to_string(),
                context_window: Some(16_385),
            },
            AiModel {
                api_name: "gpt-4".to_string(),
                label: "GPT-4".to_string(),
                context_window: Some(8_192),
            },
            AiModel {
                api_name: "gpt-4-32k".to_string(),
                label: "GPT-4 32k".to_string(),
                context_window: Some(32_768),
            },
        ],
    );
    models.insert(
        "Groq".to_string(),
        vec![
            AiModel {
                api_name: "llama2-70b-4096".to_string(),
                label: "LLaMA2 70b".to_string(),
                context_window: Some(4_096),
            },
            AiModel {
                api_name: "mixtral-8x7b-32768".to_string(),
                label: "Mixtral 8x7b".to_string(),
                context_window: Some(32_768),
            },
            AiModel {
                api_name: "gemma-7b-it".to_string(),
                label: "Gemma 7b it".to_string(),
                context_window: Some(8_192),
            },
        ],
    );
    models.insert(
        "Anthropic".to_string(),
        vec![
            AiModel {
                api_name: "claude-3-opus-20240229".to_string(),
                label: "Claude 3 Opus".to_string(),
                context_window: Some(200_000),
            },
            AiModel {
                api_name: "claude-3-sonnet-20240229".to_string(),
                label: "Claude 3 Sonnet".to_string(),
                context_window: Some(200_000),
            },
            AiModel {
                api_name: "claude-2.1".to_string(),
                label: "Claude 2.1".to_string(),
                context_window: Some(200_000),
            },
            AiModel {
                api_name: "claude-2.0".to_string(),
                label: "Claude 2.0".to_string(),
                context_window: Some(100_000),
            },
        ],
    );
    models
}

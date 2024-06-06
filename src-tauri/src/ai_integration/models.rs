use std::collections::HashSet;

use serde::Serialize;
use sqlx::SqliteConnection;
use ts_rs::TS;
use url::Url;

use crate::error::DwataError;

use super::{AIIntegration, AIProvider};

#[derive(Debug, Eq, Hash, PartialEq, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub enum AIModelFeatures {
    TextGeneration,
    // Embedding,
    ImageRecognition,
    // ImageGeneration,
    // SpeechRecognition,
    // SpeechGeneration,
}

#[derive(Debug, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub enum AIModelDeveloper {
    SameAsProvider,
    // OpenAI,
    // Anthropic,
    Mistral,
    Meta,
    Google,
}

#[derive(Debug, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct AIModel {
    pub label: String,
    pub ai_provider: AIProvider,
    pub developer: Option<AIModelDeveloper>,
    pub features: HashSet<AIModelFeatures>,

    pub api_name: String,
    pub latest_version_api_name: Option<String>,
    // Optionally needed for Ollama
    pub tag: Option<String>,

    pub context_window: Option<i32>,
    // Prices are in US cents
    pub price_per_million_input_tokens: Option<i32>,
    pub price_per_million_output_tokens: Option<i32>,
    pub link_to_model_documentation: Option<Url>,
}

impl AIModel {
    pub fn new(
        label: &str,
        ai_provider: AIProvider,
        developer: Option<AIModelDeveloper>,
        features: HashSet<AIModelFeatures>,
        api_name: &str,
        latest_version_api_name: Option<&str>,
        context_window: Option<i32>,
        price_per_million_input_tokens: Option<i32>,
        price_per_million_output_tokens: Option<i32>,
        link_to_model_documentation: Option<&str>,
    ) -> Self {
        AIModel {
            label: label.to_string(),
            ai_provider,
            developer,
            features,
            api_name: api_name.to_string(),
            latest_version_api_name: latest_version_api_name.map(|x| x.to_string()),
            tag: None,
            context_window,
            price_per_million_input_tokens,
            price_per_million_output_tokens,
            link_to_model_documentation: link_to_model_documentation
                .and_then(|x| Url::parse(x).ok()),
        }
    }

    pub fn get_all_models() -> Vec<AIModel> {
        let mut result: Vec<AIModel> = vec![];
        result.extend(AIModel::get_models_for_openai());
        result.extend(AIModel::get_models_for_groq());
        result.extend(AIModel::get_models_for_anthropic());
        result.extend(AIModel::get_models_for_ollama());
        result.extend(AIModel::get_models_for_mistral());
        result
    }

    pub fn from_string(requested_ai_model: String) -> Result<Self, DwataError> {
        let (provider_name, model_name) = requested_ai_model.split_once("::").unwrap();
        let all_models = Self::get_all_models();
        let model = all_models
            .into_iter()
            .find(|x| x.ai_provider.to_string() == provider_name && x.api_name == model_name)
            .ok_or(DwataError::InvalidAIModel)?;
        Ok(model)
    }

    pub async fn get_integration(
        &self,
        _db_connection: &mut SqliteConnection,
    ) -> Result<AIIntegration, DwataError> {
        return Err(DwataError::InvalidAIProvider);
    }
}

impl AIModel {
    pub fn get_models_for_openai() -> Vec<AIModel> {
        let mut models: Vec<AIModel> = vec![];
        models.push(AIModel::new(
            "GPT-3.5 Turbo",
            AIProvider::OpenAI,
            Some(AIModelDeveloper::SameAsProvider),
            HashSet::from([AIModelFeatures::TextGeneration]),
            "gpt-3.5-turbo",
            Some("gpt-3.5-turbo-0125"),
            Some(16_385),
            Some(0),
            Some(0),
            None,
        ));
        models.push(AIModel::new(
            "GPT-4 Turbo",
            AIProvider::OpenAI,
            Some(AIModelDeveloper::SameAsProvider),
            HashSet::from([
                AIModelFeatures::TextGeneration,
                AIModelFeatures::ImageRecognition,
            ]),
            "gpt-4-turbo",
            Some("gpt-4-turbo-2024-04-09"),
            Some(128_000),
            Some(0),
            Some(0),
            None,
        ));
        models.push(AIModel::new(
            "GPT-4o",
            AIProvider::OpenAI,
            Some(AIModelDeveloper::SameAsProvider),
            HashSet::from([
                AIModelFeatures::TextGeneration,
                AIModelFeatures::ImageRecognition,
            ]),
            "gpt-4o",
            Some("gpt-4o-2024-05-13"),
            Some(128_000),
            Some(0),
            Some(0),
            None,
        ));
        models
    }
}

impl AIModel {
    pub fn get_models_for_groq() -> Vec<AIModel> {
        let mut models: Vec<AIModel> = vec![];
        models.push(AIModel::new(
            "LLaMA3 8b",
            AIProvider::Groq,
            Some(AIModelDeveloper::Meta),
            HashSet::from([AIModelFeatures::TextGeneration]),
            "llama3-8b-8192",
            None,
            Some(8_192),
            None,
            None,
            None,
        ));
        models.push(AIModel::new(
            "LLaMA3 70b",
            AIProvider::Groq,
            Some(AIModelDeveloper::Meta),
            HashSet::from([AIModelFeatures::TextGeneration]),
            "llama3-70b-8192",
            None,
            Some(8_192),
            None,
            None,
            None,
        ));
        models.push(AIModel::new(
            "Mixtral 8x7b",
            AIProvider::Groq,
            Some(AIModelDeveloper::Mistral),
            HashSet::from([AIModelFeatures::TextGeneration]),
            "mixtral-8x7b-32768",
            None,
            Some(32_768),
            None,
            None,
            None,
        ));
        models.push(AIModel::new(
            "Gemma 7b",
            AIProvider::Groq,
            Some(AIModelDeveloper::Google),
            HashSet::from([AIModelFeatures::TextGeneration]),
            "gemma-7b-it",
            None,
            Some(8_192),
            None,
            None,
            None,
        ));
        models
    }
}

impl AIModel {
    pub fn get_models_for_anthropic() -> Vec<AIModel> {
        vec![]
    }
}

impl AIModel {
    pub fn get_models_for_ollama() -> Vec<AIModel> {
        vec![]
    }
}

impl AIModel {
    pub fn get_models_for_mistral() -> Vec<AIModel> {
        vec![]
    }
}

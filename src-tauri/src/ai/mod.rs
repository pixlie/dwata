use crate::ai::api_types::APIAIIntegration;
use crate::ai::providers::openai::{ChatRequestMessage, OpenAIChatRequest};
use openai::types::create_embedding_request::EncodingFormat;
use openai::types::{
    CreateEmbeddingRequest, CreateEmbeddingRequestInput, CreateEmbeddingRequestModel,
};
use reqwest::RequestBuilder;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt::Display;
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
    Anthropic(HttpsApi),
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
            Self::Anthropic(_) => "Anthropic".to_string(),
        }
    }

    pub fn get_api_key(&self) -> String {
        match self {
            Self::OpenAI(api) => api.api_key.clone(),
            Self::Groq(api) => api.api_key.clone(),
            Self::Anthropic(api) => api.api_key.clone(),
        }
    }
}

impl AiProvider {
    // Chat related
    pub fn get_chat_url_and_key(&self) -> (String, String) {
        match self {
            Self::OpenAI(api) => (
                "https://api.openai.com/v1/chat/completions".to_string(),
                api.api_key.clone(),
            ),
            Self::Groq(api) => (
                "https://api.groq.com/openai/v1/chat/completions".to_string(),
                api.api_key.clone(),
            ),
            Self::Anthropic(api) => (
                "https://api.anthropic.com/v1/messages".to_string(),
                api.api_key.clone(),
            ),
        }
    }

    pub fn build_chat_https_request(
        &self,
        ai_model: String,
        message_to_send: String,
        tool_list: Vec<Tool>,
    ) -> RequestBuilder {
        let (chat_url, api_key) = self.get_chat_url_and_key();
        let https_client = reqwest::Client::new();
        let payload: OpenAIChatRequest = OpenAIChatRequest {
            model: ai_model,
            messages: vec![ChatRequestMessage {
                role: "user".to_string(),
                content: message_to_send,
            }],
            tools: vec![],
        };
        let payload = payload.add_tools(tool_list);
        let request_builder = https_client
            .post(chat_url)
            .header("Authorization", format!("Bearer {}", api_key))
            .json::<OpenAIChatRequest>(&payload);
        println!("{}", serde_json::to_string_pretty(&payload).unwrap());
        request_builder
    }
}

impl AiProvider {
    // Embedding related
    pub fn get_embedding_url_and_key(&self) -> (String, String) {
        match self {
            Self::OpenAI(api) => (
                "https://api.openai.com/v1/embeddings".to_string(),
                api.api_key.clone(),
            ),
            Self::Groq(api) => (
                "https://api.groq.com/openai/v1/embeddings".to_string(),
                api.api_key.clone(),
            ),
            Self::Anthropic(api) => (
                "https://api.voyageai.com/v1/embeddings".to_string(),
                api.api_key.clone(),
            ),
        }
    }

    pub fn build_embedding_https_request(
        &self,
        ai_model: String,
        text_to_embed: String,
    ) -> RequestBuilder {
        let (chat_url, api_key) = self.get_embedding_url_and_key();
        let https_client = reqwest::Client::new();
        let payload: CreateEmbeddingRequest = CreateEmbeddingRequest::new(
            CreateEmbeddingRequestInput::String(text_to_embed),
            ai_model,
        );
        let request_builder = https_client
            .post(chat_url)
            .header("Authorization", format!("Bearer {}", api_key))
            .json::<CreateEmbeddingRequest>(&payload);
        println!("{}", serde_json::to_string_pretty(&payload).unwrap());
        request_builder
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

    pub fn update(&mut self, ai_provider: &str, api_key: &str, display_label: Option<&str>) {
        self.ai_provider = AiProvider::new(ai_provider, api_key);
        self.display_label = display_label.map(|x| x.to_string());
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

    pub fn match_by_provider_name(&self, provider_name: &str) -> bool {
        self.ai_provider.get_name() == provider_name
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
    // models.insert(
    //     "Anthropic".to_string(),
    //     vec![
    //         AiModel {
    //             api_name: "claude-3-opus-20240229".to_string(),
    //             label: "Claude 3 Opus".to_string(),
    //             context_window: Some(200_000),
    //         },
    //         AiModel {
    //             api_name: "claude-3-sonnet-20240229".to_string(),
    //             label: "Claude 3 Sonnet".to_string(),
    //             context_window: Some(200_000),
    //         },
    //         AiModel {
    //             api_name: "claude-2.1".to_string(),
    //             label: "Claude 2.1".to_string(),
    //             context_window: Some(200_000),
    //         },
    //         AiModel {
    //             api_name: "claude-2.0".to_string(),
    //             label: "Claude 2.0".to_string(),
    //             context_window: Some(100_000),
    //         },
    //     ],
    // );
    models
}

#[derive(Deserialize, Serialize)]
pub(crate) enum ToolParameterType {
    String,
    Number,
    Boolean,
    Enum(Vec<String>),
}

impl Display for ToolParameterType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ToolParameterType::String => write!(f, "string"),
            ToolParameterType::Number => write!(f, "number"),
            ToolParameterType::Boolean => write!(f, "boolean"),
            ToolParameterType::Enum(e) => write!(f, "string"),
        }
    }
}

#[derive(Deserialize, Serialize)]
pub(crate) struct ToolParameter {
    name: String,
    parameter_type: ToolParameterType,
    description: String,
}

impl ToolParameter {
    pub fn new(name: String, parameter_type: ToolParameterType, description: String) -> Self {
        Self {
            name,
            parameter_type,
            description,
        }
    }
}

#[derive(Deserialize, Serialize)]
pub(crate) struct Tool {
    name: String,
    description: String,
    parameters: Vec<ToolParameter>,
    required: Vec<String>,
}

impl Tool {
    pub fn new(
        name: String,
        description: String,
        parameters: Vec<ToolParameter>,
        required: Vec<String>,
    ) -> Self {
        Self {
            name,
            description,
            parameters,
            required,
        }
    }
}

pub(crate) trait AITools {
    fn get_self_tool_list(&self) -> Vec<Tool>;
}

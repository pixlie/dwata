use serde::{Deserialize, Serialize};
use ulid::Ulid;

pub mod helpers;
pub mod providers;

#[derive(Debug, Deserialize, Serialize)]
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

#[derive(Debug, Deserialize, Serialize)]
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
}

#[derive(Debug, Deserialize, Serialize)]
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
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct AiModel {
    name: String,
    user_account_id: i64,
}

impl AiModel {
    pub(crate) fn get_name(&self) -> String {
        self.name.clone()
    }
}

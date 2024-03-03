pub mod helpers;
pub mod providers;

use serde::{Deserialize, Serialize};

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
pub enum AiProvider {
    OpenAI(HttpsApi),
    Groq(HttpsApi),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AiIntegration {
    ai_provider: AiProvider,
    display_label: Option<String>,
}

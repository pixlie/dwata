pub mod helpers;

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct HttpsApi {
    api_key: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum AiProvider {
    ChatGPT(HttpsApi),
    Groq(HttpsApi),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AiIntegration {
    ai_provider: AiProvider,
    display_label: Option<String>,
}

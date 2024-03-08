use crate::user_account::UserAccount;
use serde::{Deserialize, Serialize};
use sqlx::{types::Json, FromRow};

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

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct AiIntegration {
    id: u32,
    ai_provider: AiProvider,
    display_label: Option<String>,
}

#[derive(FromRow)]
pub(crate) struct AiIntegrationRow {
    id: u32,
    json_data: Json<AiIntegration>,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct AiModel {
    id: u32,
    ai_provider: AiProvider,
    user_account: UserAccount,
    name: String,
    label: String,
    description: String,
}

#[derive(FromRow)]
pub(crate) struct AiModelRow {
    id: u32,
    ai_provider_id: u32,
    user_account_id: u32,
    json_data: Json<AiModel>,
}

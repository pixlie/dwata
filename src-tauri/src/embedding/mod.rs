use openai::types::{CreateEmbeddingRequest, CreateEmbeddingRequestInput};
use reqwest::RequestBuilder;

use crate::{ai::AIProvider, error::DwataError};

// pub mod commands;
// pub mod storage;

impl AIProvider {
    // Embedding related
    pub fn get_embedding_url(&self) -> Option<String> {
        match self {
            Self::OpenAI => Some("https://api.openai.com/v1/embeddings".to_string()),
            Self::Groq => None,
            Self::Anthropic => None,
        }
    }

    pub fn build_embedding_https_request(
        &self,
        api_key: String,
        ai_model: String,
        text_to_embed: String,
    ) -> Result<RequestBuilder, DwataError> {
        let chat_url = self.get_embedding_url();
        if chat_url.is_none() {
            return Err(DwataError::FeatureNotAvailableWithAIProvider);
        }
        let https_client = reqwest::Client::new();
        let payload: CreateEmbeddingRequest = CreateEmbeddingRequest::new(
            CreateEmbeddingRequestInput::String(text_to_embed),
            ai_model,
        );
        let request_builder = https_client
            .post(chat_url.unwrap())
            .header("Authorization", format!("Bearer {}", api_key))
            .json::<CreateEmbeddingRequest>(&payload);
        println!("{}", serde_json::to_string_pretty(&payload).unwrap());
        Ok(request_builder)
    }
}

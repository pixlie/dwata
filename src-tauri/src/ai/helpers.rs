use super::providers::openai::{ChatRequestMessage, OpenAIChatRequest, OpenAIChatResponse};
use super::{AiIntegration, AiProvider};
use crate::error::DwataError;
use reqwest;

pub async fn send_message_to_ai(
    ai_integration: AiIntegration,
    ai_model: String,
    message_to_send: String,
) -> Result<String, DwataError> {
    let (chat_url, api_key) = match ai_integration.ai_provider {
        AiProvider::OpenAI(x) => ("https://api.openai.com/v1/chat/completions", x.api_key),
        AiProvider::Groq(x) => ("https://api.groq.com/openai/v1/chat/completions", x.api_key),
    };
    let payload: OpenAIChatRequest = OpenAIChatRequest {
        model: ai_model,
        messages: vec![ChatRequestMessage {
            role: "user".to_string(),
            content: message_to_send,
        }],
    };
    let https_client = reqwest::Client::new();
    let request = https_client
        .post(chat_url)
        .header("Authorization", format!("Bearer {}", api_key))
        .json::<OpenAIChatRequest>(&payload)
        .send()
        .await;
    match request {
        Ok(response) => {
            if response.status().is_success() {
                let payload = response.json::<OpenAIChatResponse>().await;
                match payload {
                    Ok(response) => Ok(response.choices[0].message.content.clone()),
                    Err(_) => Err(DwataError::CouldNotConnectToAiProvider),
                }
            } else {
                println!(
                    "Error: {}\n{}",
                    response.status(),
                    response.text().await.unwrap()
                );
                Err(DwataError::CouldNotConnectToAiProvider)
            }
        }
        Err(_) => Err(DwataError::CouldNotConnectToAiProvider),
    }
}

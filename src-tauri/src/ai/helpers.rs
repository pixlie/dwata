use super::providers::openai::{ChatRequestMessage, OpenAIChatRequest, OpenAIChatResponse};
use super::{AiIntegration};
use crate::error::DwataError;
use reqwest;
use reqwest::RequestBuilder;

pub(crate) fn add_user_message(
    ai_model: String,
    message_to_send: String,
    request_builder: RequestBuilder,
) -> RequestBuilder {
    let payload: OpenAIChatRequest = OpenAIChatRequest {
        model: ai_model,
        messages: vec![ChatRequestMessage {
            role: "user".to_string(),
            content: message_to_send,
        }],
    };
    request_builder.json::<OpenAIChatRequest>(&payload)
}

pub(crate) fn build_https_request(
    ai_integration: AiIntegration,
    ai_model: String,
    message_to_send: String,
) -> RequestBuilder {
    let (chat_url, api_key) = ai_integration.ai_provider.get_api_url_and_key();
    let https_client = reqwest::Client::new();
    let request_builder = https_client
        .post(chat_url)
        .header("Authorization", format!("Bearer {}", api_key));
    let request_builder = add_user_message(ai_model, message_to_send, request_builder);
    ai_integration.ai_provider.add_tools(request_builder)
}

pub async fn send_message_to_ai(
    ai_integration: AiIntegration,
    ai_model: String,
    message_to_send: String,
) -> Result<String, DwataError> {
    let request = build_https_request(ai_integration, ai_model, message_to_send)
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

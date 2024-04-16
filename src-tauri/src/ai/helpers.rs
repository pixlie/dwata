use super::providers::openai::OpenAIChatResponse;
use super::{AiIntegration, Tool};
use crate::error::DwataError;
use reqwest;

pub async fn send_message_to_ai(
    ai_integration: AiIntegration,
    ai_model: String,
    message_to_send: String,
    tool_list: Vec<Tool>,
) -> Result<String, DwataError> {
    let request =
        ai_integration
            .ai_provider
            .build_https_request(ai_model, message_to_send, tool_list);
    println!("{:?}", request);
    let response = request.send().await;
    match response {
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

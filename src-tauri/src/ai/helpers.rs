use super::{AiIntegration, Tool};
use crate::chat::ChatToolResponse;
use crate::error::DwataError;
use openai::types::chat_completion_message_tool_call::Type;
use openai::types::CreateChatCompletionResponse;
use reqwest;

pub async fn send_message_to_ai(
    ai_integration: AiIntegration,
    ai_model: String,
    message_to_send: String,
    tool_list: Vec<Tool>,
) -> Result<(String, Option<Vec<ChatToolResponse>>), DwataError> {
    let request =
        ai_integration
            .ai_provider
            .build_https_request(ai_model, message_to_send, tool_list);

    let response = request.send().await;
    match response {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<CreateChatCompletionResponse>().await {
                    Ok(response) => {
                        if response.choices[0].message.tool_calls.is_some() {
                            // We have received a tool call
                            Ok((
                                "".to_string(),
                                Some(
                                    response.choices[0]
                                        .message
                                        .tool_calls
                                        .clone()
                                        .unwrap()
                                        .iter()
                                        .map(|x| {
                                            ChatToolResponse::new(
                                                x.function.name.clone(),
                                                match x.r#type {
                                                    Type::Function => "function".to_string(),
                                                },
                                                x.function.arguments.clone(),
                                            )
                                        })
                                        .collect(),
                                ),
                            ))
                        } else {
                            Ok((
                                response.choices[0]
                                    .message
                                    .content
                                    .clone()
                                    .unwrap_or_else(|| "".to_string()),
                                None,
                            ))
                        }
                    }
                    Err(err) => {
                        println!("{:?}", err);
                        Err(DwataError::CouldNotConnectToAiProvider)
                    }
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

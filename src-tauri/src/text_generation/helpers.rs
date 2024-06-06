use crate::ai_integration::AIIntegration;
use crate::chat::ChatToolResponse;
use crate::error::DwataError;
use openai::types::chat_completion_message_tool_call::Type;
use openai::types::{CreateChatCompletionResponse, CreateEmbeddingResponse};

pub async fn get_chat_response_from_ai_provider(
    ai_integration: AIIntegration,
    ai_model: String,
    message_to_send: String,
    // tool_list: Vec<Tool>,
) -> Result<(String, Option<Vec<ChatToolResponse>>), DwataError> {
    let request = ai_integration.build_chat_https_request(ai_model, message_to_send); //, tool_list);

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
                        Err(DwataError::CouldNotConnectToAIProvider)
                    }
                }
            } else {
                println!(
                    "Error: {}\n{}",
                    response.status(),
                    response.text().await.unwrap()
                );
                Err(DwataError::CouldNotConnectToAIProvider)
            }
        }
        Err(_) => Err(DwataError::CouldNotConnectToAIProvider),
    }
}

pub async fn get_embedding_from_ai_provider(
    ai_integration: &AIIntegration,
    ai_model: String,
    text_to_embed: String,
) -> Result<Vec<f32>, DwataError> {
    let request = ai_integration.build_embedding_https_request(ai_model, text_to_embed);

    let response = request.send().await;
    match response {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<CreateEmbeddingResponse>().await {
                    Ok(response) => Ok(response.data[0]
                        .embedding
                        .iter()
                        .map(|n| n.clone() as f32)
                        .collect()),
                    Err(err) => {
                        println!("{:?}", err);
                        Err(DwataError::CouldNotConnectToAIProvider)
                    }
                }
            } else {
                println!(
                    "Error: {}\n{}",
                    response.status(),
                    response.text().await.unwrap()
                );
                Err(DwataError::CouldNotConnectToAIProvider)
            }
        }
        Err(_) => Err(DwataError::CouldNotConnectToAIProvider),
    }
}

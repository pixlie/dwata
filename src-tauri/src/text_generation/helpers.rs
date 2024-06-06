use crate::ai_integration::models::AIModel;
use crate::ai_integration::AIIntegration;
use crate::chat::ChatToolResponse;
use crate::error::DwataError;
use openai::types::chat_completion_message_tool_call::Type;
use openai::types::CreateChatCompletionResponse;

pub async fn generate_text_with_ai_model(
    ai_integration: AIIntegration,
    ai_model: AIModel,
    message_to_send: String,
    // tool_list: Vec<Tool>,
) -> Result<(Option<String>, Option<Vec<ChatToolResponse>>), DwataError> {
    let request = ai_integration.build_text_generation_https_request(ai_model, message_to_send)?; //, tool_list);
    let response = request.send().await;
    match response {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<CreateChatCompletionResponse>().await {
                    Ok(response) => {
                        if response.choices[0].message.tool_calls.is_some() {
                            // We have received a tool call
                            Ok((
                                None,
                                Some(
                                    response.choices[0]
                                        .message
                                        .tool_calls
                                        .clone()
                                        .unwrap()
                                        .iter()
                                        .map(|x| ChatToolResponse {
                                            tool_name: x.function.name.clone(),
                                            tool_type: match x.r#type {
                                                Type::Function => "function".to_string(),
                                            },
                                            arguments: x.function.arguments.clone(),
                                        })
                                        .collect(),
                                ),
                            ))
                        } else {
                            Ok((
                                Some(
                                    response.choices[0]
                                        .message
                                        .content
                                        .clone()
                                        .unwrap_or_else(|| "".to_string()),
                                ),
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

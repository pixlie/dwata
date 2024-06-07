use crate::ai_integration::models::AIModel;
use crate::ai_integration::AIIntegration;
use crate::chat::{Chat, ChatCreateUpdate, ChatToolResponse};
use crate::error::DwataError;
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead, InsertUpdateResponse};
use openai::types::chat_completion_message_tool_call::Type;
use openai::types::CreateChatCompletionResponse;
use sqlx::SqliteConnection;

pub async fn generate_text_for_chat(
    chat_id: i64,
    db_connection: &mut SqliteConnection,
) -> Result<InsertUpdateResponse, DwataError> {
    let chat = Chat::read_one_by_pk(chat_id, db_connection).await?;
    if chat.message.is_none() {
        return Err(DwataError::ChatDoesNotHaveMessage);
    }
    if chat.requested_ai_model.is_none() {
        return Err(DwataError::ChatDoesNotHaveAIModel);
    }
    if chat.is_processed_by_ai.is_some_and(|x| x) {
        return Err(DwataError::ChatHasBeenProcessedByAI);
    }
    let model = AIModel::from_string(chat.requested_ai_model.unwrap())?;
    let ai_integration = model.get_integration(db_connection).await?;

    let reply_from_ai =
        generate_text_with_ai_model(ai_integration, model, chat.message.unwrap()).await?;
    let (message_opt, tool_responses_opt) = reply_from_ai;
    let existing_chat = ChatCreateUpdate {
        is_processed_by_ai: Some(true),
        ..ChatCreateUpdate::default()
    };
    existing_chat
        .update_module_data(chat.id, db_connection)
        .await?;
    if let Some(message) = message_opt {
        let new_chat = ChatCreateUpdate {
            previous_chat_id: Some(chat_id),
            message: Some(message),
            ..ChatCreateUpdate::default()
        };
        new_chat.insert_module_data(db_connection).await
    } else {
        let new_chat = ChatCreateUpdate {
            previous_chat_id: Some(chat_id),
            tool_response: tool_responses_opt,
            ..ChatCreateUpdate::default()
        };
        new_chat.insert_module_data(db_connection).await
    }
}

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

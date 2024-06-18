use super::{TextGenerationRequest, TextGenerationResponse};
use crate::ai_integration::models::AIModel;
use crate::chat::{Chat, ChatCreateUpdate, ChatFilters, Role};
use crate::error::DwataError;
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead, InsertUpdateResponse};
use sqlx::SqliteConnection;

/// Generates response for a chat thread.
/// This function sends all previous messages for this thread to the AI model.
/// It is possible that the entire has already been sent to an AI model and you want to try another model.
///
/// # Arguments
///
/// * `root_chat_id` - The ID of the root chat of this thread to generate text for.
/// * `db` - The Dwata database connection.
///
/// # Returns
///
/// * `Result<InsertUpdateResponse, DwataError>` - The response from the AI model.
pub async fn generate_text_for_chat(
    chat_id: i64,
    db_connection: &mut SqliteConnection,
) -> Result<InsertUpdateResponse, DwataError> {
    let mut root_chat = Chat::read_one_by_pk(chat_id, db_connection).await?;
    if root_chat.message.is_none() {
        return Err(DwataError::ChatHasNoMessage);
    }
    if root_chat.requested_ai_model.is_none() {
        return Err(DwataError::NoRequestedAIModel);
    }
    if root_chat.is_processed_by_ai.is_some_and(|x| x) {
        return Err(DwataError::AlreadyProcessedByAI);
    }
    let model = AIModel::from_string(root_chat.requested_ai_model.unwrap()).await?;
    let ai_integration = model.get_integration(db_connection).await?;

    // Get the root chat of this thread (the first chat in the thread)
    if root_chat.root_chat_id.is_some() {
        root_chat = Chat::read_one_by_pk(root_chat.root_chat_id.unwrap(), db_connection).await?;
    }

    // Get all the chats in this thread
    let chats = Chat::read_with_filter(
        ChatFilters {
            root_chat_id: Some(root_chat.id),
            ..Default::default()
        },
        db_connection,
    )
    .await?;

    // Convert chats into a list of messages to send to AI model
    // Convert the root chat
    let mut messages_to_send: Vec<TextGenerationRequest> = vec![TextGenerationRequest {
        role: Role::User,
        content: root_chat.message.unwrap(),
    }];

    // Add all the other chats in this thread
    for chat in chats {
        messages_to_send.push(TextGenerationRequest {
            role: chat.role.unwrap(),
            content: chat.message.unwrap(),
        });
    }

    let reply_from_ai = ai_integration
        .generate_text_with_ai(model, messages_to_send)
        .await?;
    let existing_chat = ChatCreateUpdate {
        is_processed_by_ai: Some(true),
        ..ChatCreateUpdate::default()
    };
    existing_chat
        .update_module_data(root_chat.id, db_connection)
        .await?;
    match reply_from_ai {
        TextGenerationResponse::Message(message) => {
            let new_chat = ChatCreateUpdate {
                root_chat_id: Some(root_chat.id),
                message: Some(message),
                role: Some(Role::Assistant.to_string()),
                ..ChatCreateUpdate::default()
            };
            new_chat.insert_module_data(db_connection).await
        }
        TextGenerationResponse::Tool(tool_response) => {
            let new_chat = ChatCreateUpdate {
                root_chat_id: Some(root_chat.id),
                tool_response: Some(tool_response),
                role: Some(Role::Assistant.to_string()),
                ..ChatCreateUpdate::default()
            };
            new_chat.insert_module_data(db_connection).await
        }
    }
}

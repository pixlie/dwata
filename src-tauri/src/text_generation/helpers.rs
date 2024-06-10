use sqlx::SqliteConnection;

use crate::ai_integration::models::AIModel;
use crate::chat::{Chat, ChatCreateUpdate};
use crate::error::DwataError;
use crate::text_generation::TextGenerationResponse;
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead, InsertUpdateResponse};

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
    let model = AIModel::from_string(chat.requested_ai_model.unwrap()).await?;
    let ai_integration = model.get_integration(db_connection).await?;

    let reply_from_ai = ai_integration
        .generate_text_with_ai(model, chat.message.unwrap())
        .await?;
    let existing_chat = ChatCreateUpdate {
        is_processed_by_ai: Some(true),
        ..ChatCreateUpdate::default()
    };
    existing_chat
        .update_module_data(chat.id, db_connection)
        .await?;
    match reply_from_ai {
        TextGenerationResponse::Message(message) => {
            let new_chat = ChatCreateUpdate {
                root_chat_id: Some(chat_id),
                message: Some(message),
                ..ChatCreateUpdate::default()
            };
            new_chat.insert_module_data(db_connection).await
        }
        TextGenerationResponse::Tool(tool_response) => {
            let new_chat = ChatCreateUpdate {
                root_chat_id: Some(chat_id),
                tool_response: Some(tool_response),
                ..ChatCreateUpdate::default()
            };
            new_chat.insert_module_data(db_connection).await
        }
    }
}

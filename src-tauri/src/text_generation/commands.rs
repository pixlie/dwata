use super::helpers::generate_text_with_ai_model;
use crate::ai_integration::models::AIModel;
use crate::chat::{Chat, ChatCreateUpdate};
// use crate::ai::AITools;
// use crate::chat::api_types::{APIChatContextNode, APIChatReply, APIChatThread};
use crate::error::DwataError;
use crate::workspace::crud::{CRUDHelperCreateUpdate, InsertUpdateResponse, CRUD};
use crate::workspace::DwataDb;
use tauri::State;

#[tauri::command]
pub async fn generate_text_for_chat(
    chat_id: i64,
    db: State<'_, DwataDb>,
) -> Result<InsertUpdateResponse, DwataError> {
    let mut db_guard = db.lock().await;
    let chat = Chat::read_one_by_pk(chat_id, &mut db_guard).await?;
    if chat.message.is_none() {
        return Err(DwataError::ChatDoesNotHaveMessage);
    }
    if chat.requested_ai_model.is_none() {
        return Err(DwataError::ChatDoesNotHaveAIModel);
    }
    let model = AIModel::from_string(chat.requested_ai_model.unwrap())?;
    let ai_integration = model.get_integration(&mut db_guard).await?;

    let reply_from_ai =
        generate_text_with_ai_model(ai_integration, model, chat.message.unwrap()).await?;
    let (message_opt, tool_responses_opt) = reply_from_ai;
    if let Some(message) = message_opt {
        let new_chat = ChatCreateUpdate {
            role: None,
            previous_chat_id: Some(chat_id),
            message: Some(message),
            requested_ai_model: None,
            tool_response: None,
        };
        new_chat.insert_module_data(&mut db_guard).await
    } else {
        let new_chat = ChatCreateUpdate {
            role: None,
            previous_chat_id: Some(chat_id),
            message: None,
            requested_ai_model: None,
            tool_response: tool_responses_opt,
        };
        new_chat.insert_module_data(&mut db_guard).await
    }
}

// #[tauri::command]
// pub(crate) async fn fetch_chat_context_node_list(
//     node_path: Vec<String>,
//     store: State<'_, Store>,
// ) -> Result<Vec<APIChatContextNode>, DwataError> {
//     let config_guard = store.config.lock().await;
//     Ok(config_guard.get_next_chat_context_node_list(&node_path[..]))
// }

// #[tauri::command]
// pub(crate) async fn fetch_chat_context(
//     node_path: Vec<String>,
//     store: State<'_, Store>,
// ) -> Result<String, DwataError> {
//     let config_guard = store.config.lock().await;
//     config_guard.get_chat_context(&node_path[..]).await
// }

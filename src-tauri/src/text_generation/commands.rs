use crate::ai_integration::helpers::get_chat_response_from_ai_provider;
// use crate::ai::AITools;
// use crate::chat::api_types::{APIChatContextNode, APIChatReply, APIChatThread};
use crate::chat::crud::{create_chat_reply, create_chat_thread, update_reply_sent_to_ai};
use crate::chat::{ChatContextNode, ChatReplyRow, ChatThreadRow};
use crate::error::DwataError;
use crate::workspace::helpers::load_ai_integration;
use crate::workspace::{DwataDb, Store};
use sqlx::query_as;
use tauri::State;

#[tauri::command]
pub(crate) async fn send_chat_to_ai(
    chat_id: i64,
    message: String,
    ai_provider: String,
    ai_model: String,
    db: State<'_, DwataDb>,
) -> Result<(i64, i64), DwataError> {
    let mut db_guard = db.lock().await;
    // The default user has ID 1
    let config_guard = store.config.lock().await;
    match load_ai_integration(&config_guard, &ai_provider) {
        Some(ai_integration) => {
            // It does not matter if we fail this request, we will try again later
            match get_chat_response_from_ai_provider(
                ai_integration,
                ai_model.to_string(),
                message.to_string(),
                config_guard.get_self_tool_list(),
            )
            .await
            {
                Ok(reply_from_ai) => {
                    let _ = create_chat_reply(
                        reply_from_ai,
                        false,
                        false,
                        true,
                        inserted_ids.0,
                        created_by_id,
                        conn,
                    )
                    .await;
                    update_reply_sent_to_ai(inserted_ids.1, conn).await;
                }
                Err(x) => {
                    println!("{:?}", x);
                }
            }
        }
        None => {
            println!("Could not load ai integration");
        }
    }
    Ok(inserted_ids)
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

use crate::ai::helpers::send_message_to_ai;
use crate::chat::api_types::{APIChatContextNode, APIChatReply, APIChatThread};
use crate::chat::crud::{create_chat_reply, create_chat_thread, update_reply_sent_to_ai};
use crate::chat::{ChatContextNode, ChatReplyRow, ChatThreadRow};
use crate::error::DwataError;
use crate::store::Store;
use crate::workspace::helpers::load_ai_integration;
use sqlx::query_as;
use tauri::State;

#[tauri::command]
pub(crate) async fn start_chat_thread(
    message: &str,
    ai_provider: &str,
    ai_model: &str,
    store: State<'_, Store>,
) -> Result<(i64, i64), DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            // The default user has ID 1
            let created_by_id: i64 = 1;
            match create_chat_thread(
                message.to_string(),
                ai_provider.to_string(),
                ai_model.to_string(),
                created_by_id,
                conn,
            )
            .await
            {
                Ok(inserted_ids) => {
                    let config_guard = store.config.lock().await;
                    match load_ai_integration(&config_guard, ai_provider) {
                        Some(ai_integration) => {
                            // It does not matter if we fail this request, we will try again later
                            match send_message_to_ai(
                                ai_integration,
                                ai_model.to_string(),
                                message.to_string(),
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
                Err(x) => Err(x),
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_chat_thread_list(
    store: State<'_, Store>,
) -> Result<Vec<APIChatThread>, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            let result: Result<Vec<ChatThreadRow>, sqlx::Error> =
                query_as("SELECT * FROM chat_thread ORDER BY id DESC LIMIT 25")
                    .fetch_all(conn)
                    .await;
            match result {
                Ok(rows) => Ok(rows
                    .iter()
                    .map(|row| APIChatThread::from_sqlx_row(row))
                    .collect()),
                Err(error) => {
                    println!("{:?}", error);
                    Err(DwataError::CouldNotFetchRowsFromAppDatabase)
                }
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_chat_thread_detail(
    thread_id: i64,
    store: State<'_, Store>,
) -> Result<APIChatThread, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            let result: Result<ChatThreadRow, sqlx::Error> =
                query_as("SELECT * FROM chat_thread WHERE id = ?1")
                    .bind(thread_id)
                    .fetch_one(conn)
                    .await;
            match result {
                Ok(row) => Ok(APIChatThread::from_sqlx_row(&row)),
                Err(error) => {
                    println!("Error in fetch_chat_thread_detail: {:?}", error);
                    Err(DwataError::CouldNotFetchRowsFromAppDatabase)
                }
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_chat_reply_list(
    thread_id: i64,
    store: State<'_, Store>,
) -> Result<Vec<APIChatReply>, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            let result: Result<Vec<ChatReplyRow>, sqlx::Error> =
                query_as("SELECT * FROM chat_reply WHERE chat_thread_id = ?1")
                    .bind(thread_id)
                    .fetch_all(conn)
                    .await;
            match result {
                Ok(rows) => Ok(rows
                    .iter()
                    .map(|row| APIChatReply::from_sqlx_row(row))
                    .collect()),
                Err(error) => {
                    println!("Error in fetch_chat_reply_list: {:?}", error);
                    Err(DwataError::CouldNotFetchRowsFromAppDatabase)
                }
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_chat_context_node_list(
    node_path: Vec<String>,
    store: State<'_, Store>,
) -> Result<Vec<APIChatContextNode>, DwataError> {
    let config_guard = store.config.lock().await;
    Ok(config_guard.get_next_chat_context_node_list(&node_path[..]))
}

#[tauri::command]
pub(crate) async fn fetch_chat_context(
    node_path: Vec<String>,
    store: State<'_, Store>,
) -> Result<String, DwataError> {
    let config_guard = store.config.lock().await;
    config_guard.get_chat_context(&node_path[..]).await
}

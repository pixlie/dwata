use crate::chat::api_types::{APIChatReply, APIChatThread};
use crate::chat::crud::create_chat_thread;
use crate::chat::{ChatReplyRow, ChatThreadRow};
use crate::error::DwataError;
use crate::store::Store;
use sqlx::query_as;
use tauri::State;

#[tauri::command]
pub(crate) async fn start_chat_thread(
    message: &str,
    ai_provider: &str,
    ai_model: &str,
    store: State<'_, Store>,
) -> Result<i64, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            match create_chat_thread(
                message.to_string(),
                ai_provider.to_string(),
                ai_model.to_string(),
                conn,
            )
            .await
            {
                Ok(chat_thread_id) => Ok(chat_thread_id),
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
    id: i64,
    store: State<'_, Store>,
) -> Result<APIChatThread, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            let result: Result<ChatThreadRow, sqlx::Error> =
                query_as("SELECT * FROM chat_thread WHERE id = ?1")
                    .bind(id)
                    .fetch_one(conn)
                    .await;
            match result {
                Ok(row) => Ok(APIChatThread::from_sqlx_row(&row)),
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
pub(crate) async fn fetch_chat_reply_list(
    chat_thread_id: i64,
    store: State<'_, Store>,
) -> Result<Vec<APIChatReply>, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => {
            let result: Result<Vec<ChatReplyRow>, sqlx::Error> =
                query_as("SELECT * FROM chat_reply WHERE chat_thread_id = ?1")
                    .bind(chat_thread_id)
                    .fetch_all(conn)
                    .await;
            match result {
                Ok(rows) => Ok(rows
                    .iter()
                    .map(|row| APIChatReply::from_sqlx_row(row))
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

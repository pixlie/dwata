use crate::chat::api_types::APIChatThread;
use crate::chat::crud::create_chat_thread;
use crate::chat::{ChatThread, ChatThreadRow};
use crate::error::DwataError;
use crate::store::Store;
use log::Level::Error;
use sqlx::{query, query_as};
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
                Ok(x) => Ok(x.id),
                Err(x) => Err(x),
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_chat_threads(
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

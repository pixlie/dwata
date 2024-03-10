use crate::chat::crud::create_chat_thread;
use crate::error::DwataError;
use crate::store::Store;
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

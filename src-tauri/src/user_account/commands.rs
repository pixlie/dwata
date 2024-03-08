use crate::error::DwataError;
use crate::store::Store;
use crate::user_account::crud::create_user_account;
use tauri::State;

#[tauri::command]
pub(crate) async fn add_user(
    first_name: Option<&str>,
    last_name: Option<&str>,
    email: Option<&str>,
    store: State<'_, Store>,
) -> Result<i64, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => create_user_account(first_name, last_name, email, conn).await,
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

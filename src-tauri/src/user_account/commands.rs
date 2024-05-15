use super::models::UserAccount;
use crate::error::DwataError;
use crate::relational_database::crud::CRUD;
use crate::user_account::crud::upsert_user_account;
use crate::workspace::Store;
use tauri::State;

#[tauri::command]
pub(crate) async fn save_user(
    first_name: Option<&str>,
    last_name: Option<&str>,
    email: Option<&str>,
    store: State<'_, Store>,
) -> Result<i64, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut conn) => upsert_user_account(first_name, last_name, email, conn).await,
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_current_user(store: State<'_, Store>) -> Result<UserAccount, DwataError> {
    let mut db_guard = store.db_connection.lock().await;
    match *db_guard {
        Some(ref mut db_connection) => {
            UserAccount::read_one_by_pk(1, db_connection).await
            // let result: Result<UserAccountRow, sqlx::Error> =
            //     query_as("SELECT * FROM user_account WHERE id = ?1")
            //         .bind(1)
            //         .fetch_one(conn)
            //         .await;
            // match result {
            //     Ok(row) => Ok(UserAccount::from_sqlx_row(&row)),
            //     Err(error) => {
            //         println!("Error: {:?}", error);
            //         Err(DwataError::CouldNotFetchRowsFromAppDatabase)
            //     }
            // }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

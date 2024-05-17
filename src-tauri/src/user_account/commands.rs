use super::models::UserAccount;
use crate::error::DwataError;
use crate::relational_database::crud::{InputField, InputModel, CRUD};
use crate::workspace::DwataDb;
use log::{error, info};
use sqlx::query;
use tauri::State;

#[tauri::command]
pub(crate) async fn save_user(
    first_name: Option<&str>,
    last_name: Option<&str>,
    email: Option<&str>,
    db: State<'_, DwataDb>,
) -> Result<i64, DwataError> {
    let mut db_guard = db.lock().await;
    let mut input: InputModel = InputModel::new();
    match first_name {
        Some(x) => {
            input.insert("first_name".to_string(), InputField::Text(x.to_string()));
        }
        None => {}
    }
    match last_name {
        Some(x) => {
            input.insert("last_name".to_string(), InputField::Text(x.to_string()));
        }
        None => {}
    }
    match email {
        Some(x) => {
            input.insert("email".to_string(), InputField::Text(x.to_string()));
        }
        None => {}
    }
    let pk = 1;
    match *db_guard {
        Some(ref mut db_connection) => {
            let executed = query("SELECT * FROM user_account WHERE id = ?")
                .bind(pk)
                .fetch_one(&mut *db_connection)
                .await;
            match executed {
                Ok(_) => {
                    info!("User with id {} exists, updating", pk);
                    UserAccount::update_by_pk(pk, input, db_connection).await
                }
                Err(_) => {
                    info!("User with id {} does not exist, creating", pk);
                    UserAccount::insert(input, db_connection).await
                }
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_current_user(db: State<'_, DwataDb>) -> Result<UserAccount, DwataError> {
    let mut db_guard = db.lock().await;
    match *db_guard {
        Some(ref mut db_connection) => UserAccount::read_one_by_pk(1, db_connection).await,
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

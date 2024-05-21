use super::UserAccount;
use crate::content::form::{FormData, FormFieldData};
use crate::error::DwataError;
use crate::relational_database::crud::CRUD;
use crate::workspace::DwataDb;
use log::{error, info};
use sqlx::query;
use tauri::State;

#[tauri::command]
pub async fn save_user(
    first_name: Option<&str>,
    last_name: Option<&str>,
    email: Option<&str>,
    db: State<'_, DwataDb>,
) -> Result<i64, DwataError> {
    let mut form_data: FormData = FormData::new();
    if first_name.is_some() {
        form_data.insert(
            "first_name".to_string(),
            FormFieldData::from_string(first_name.unwrap()),
        );
    }
    if last_name.is_some() {
        form_data.insert(
            "last_name".to_string(),
            FormFieldData::from_string(last_name.unwrap()),
        );
    }
    if email.is_some() {
        form_data.insert(
            "email".to_string(),
            FormFieldData::from_string(email.unwrap()),
        );
    }
    let pk = 1;
    match *db.lock().await {
        Some(ref mut db_connection) => {
            let executed = query("SELECT * FROM user_account WHERE id = ?")
                .bind(pk)
                .fetch_one(&mut *db_connection)
                .await;
            match executed {
                Ok(_) => {
                    info!("User with id {} exists, updating", pk);
                    UserAccount::update_by_pk(pk, form_data, db_connection).await
                }
                Err(_) => {
                    info!("User with id {} does not exist, creating", pk);
                    UserAccount::insert(form_data, db_connection).await
                }
            }
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub async fn fetch_current_user(db: State<'_, DwataDb>) -> Result<UserAccount, DwataError> {
    let pk = 1;
    match *db.lock().await {
        Some(ref mut db_connection) => UserAccount::read_one_by_pk(pk, db_connection).await,
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

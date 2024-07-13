use super::EmailAccount;
use crate::workspace::crud::CRUDRead;
use crate::{error::DwataError, workspace::DwataDb};
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn fetch_emails(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut db_guard = store.lock().await;
    let email_account = EmailAccount::read_one_by_pk(pk, &mut db_guard).await?;
    let storage_dir = app.path().app_data_dir().unwrap();
    email_account
        .fetch_emails(&storage_dir, &mut db_guard)
        .await
}

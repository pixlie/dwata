use super::{Email, EmailAccount};
use crate::workspace::crud::CRUDRead;
use crate::{error::DwataError, workspace::DwataDb};
use tauri::State;

#[tauri::command]
pub async fn read_inbox(pk: i64, store: State<'_, DwataDb>) -> Result<Vec<Email>, DwataError> {
    let mut db_guard = store.lock().await;
    let email_account = EmailAccount::read_one_by_pk(pk, &mut db_guard).await?;
    email_account.read_inbox(&mut db_guard).await
}

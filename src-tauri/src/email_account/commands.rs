use super::app_state::EmailAccountsState;
use super::helpers::fetch_and_save_emails_for_email_account;
use crate::error::DwataError;
use sqlx::{Pool, Sqlite};
use std::ops::Deref;
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn fetch_emails(
    pk: i64,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
    email_account_state: State<'_, EmailAccountsState>,
) -> Result<(), DwataError> {
    fetch_and_save_emails_for_email_account(
        pk,
        &app.path().app_data_dir().unwrap(),
        db.deref(),
        email_account_state.deref(),
    )
    .await
}

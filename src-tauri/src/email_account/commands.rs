use super::EmailAccount;
use crate::workspace::crud::CRUDRead;
use crate::workspace::typesense::{TypesenseSearchResult, TypesenseSearchable};
use crate::{error::DwataError, workspace::DwataDb};
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn fetch_emails(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut db_guard = store.lock().await;
    let mut email_account = EmailAccount::read_one_by_pk(pk, &mut db_guard).await?;
    let mut storage_dir = app.path().app_data_dir().unwrap();
    storage_dir.push("emails");
    storage_dir.push(email_account.email_address.clone());
    storage_dir.push("INBOX");
    email_account.mailbox = Some("INBOX".to_string());
    email_account.storage_dir = Some(storage_dir);
    email_account.fetch_emails(&mut db_guard).await
}

#[tauri::command]
pub async fn create_collection_in_typesense(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut db_guard = store.lock().await;
    let mut email_account = EmailAccount::read_one_by_pk(pk, &mut db_guard).await?;
    let mut storage_dir = app.path().app_data_dir().unwrap();
    storage_dir.push("emails");
    storage_dir.push(email_account.email_address.clone());
    storage_dir.push("INBOX");
    email_account.mailbox = Some("INBOX".to_string());
    email_account.storage_dir = Some(storage_dir);
    email_account.delete_collection().await?;
    email_account.create_collection_in_typesense().await
}

#[tauri::command]
pub async fn index_emails(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut db_guard = store.lock().await;
    let mut email_account = EmailAccount::read_one_by_pk(pk, &mut db_guard).await?;
    let mut storage_dir = app.path().app_data_dir().unwrap();
    storage_dir.push("emails");
    storage_dir.push(email_account.email_address.clone());
    storage_dir.push("INBOX");
    email_account.mailbox = Some("INBOX".to_string());
    email_account.storage_dir = Some(storage_dir);
    email_account.index_in_typesense().await
}

#[tauri::command]
pub async fn search_emails(
    pk: i64,
    query: String,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<TypesenseSearchResult, DwataError> {
    let mut db_guard = store.lock().await;
    let mut email_account = EmailAccount::read_one_by_pk(pk, &mut db_guard).await?;
    let mut storage_dir = app.path().app_data_dir().unwrap();
    storage_dir.push("emails");
    storage_dir.push(email_account.email_address.clone());
    storage_dir.push("INBOX");
    email_account.mailbox = Some("INBOX".to_string());
    email_account.storage_dir = Some(storage_dir);
    email_account.retrieve_collection().await?;
    email_account.search_in_typesense(query).await
}

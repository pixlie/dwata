use super::EmailAccount;
use crate::workspace::crud::CRUDRead;
use crate::workspace::typesense::{TypesenseSearchResult, TypesenseSearchable};
use crate::{error::DwataError, workspace::DwataDb};
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn fetch_emails(
    pk: i64,
    app: AppHandle,
    db: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut email_account = {
        let mut db_guard = db.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    email_account
        .prep_for_access(
            "INBOX".to_string(),
            app.path().app_data_dir().unwrap(),
            true,
            app.clone(),
        )
        .await?;
    email_account.fetch_emails(app).await
}

#[tauri::command]
pub async fn create_collection_in_typesense(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut email_account = {
        let mut db_guard = store.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    email_account
        .prep_for_access(
            "INBOX".to_string(),
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.delete_collection().await?;
    email_account.create_collection_in_typesense().await
}

#[tauri::command]
pub async fn index_emails(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut email_account = {
        let mut db_guard = store.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    email_account
        .prep_for_access(
            "INBOX".to_string(),
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.index_in_typesense().await
}

#[tauri::command]
pub async fn store_emails_in_db(
    pk: i64,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<usize, DwataError> {
    let mut email_account = {
        let mut db_guard = store.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    email_account
        .prep_for_access(
            "INBOX".to_string(),
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.store_emails_in_db().await
}

#[tauri::command]
pub async fn search_emails(
    pk: i64,
    query: String,
    app: AppHandle,
    store: State<'_, DwataDb>,
) -> Result<TypesenseSearchResult, DwataError> {
    let mut email_account = {
        let mut db_guard = store.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    email_account
        .prep_for_access(
            "INBOX".to_string(),
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.retrieve_collection().await?;
    email_account.search_in_typesense(query).await
}

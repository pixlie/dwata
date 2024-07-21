use super::{EmailAccount, MailboxChoice};
use crate::workspace::crud::CRUDRead;
use crate::workspace::typesense::{SearchCollection, SearchResult, TypesenseSearchable};
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
    // Let's work with the Sent folder
    email_account
        .prep_for_access(
            MailboxChoice::Sent,
            app.path().app_data_dir().unwrap(),
            true,
            app.clone(),
        )
        .await?;
    email_account.fetch_emails(app.clone()).await?;

    // Let's work with the Inbox folder
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
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
    db: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut email_account = {
        let mut db_guard = db.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    // Let's work with the Sent folder
    email_account
        .prep_for_access(
            MailboxChoice::Sent,
            app.path().app_data_dir().unwrap(),
            true,
            app.clone(),
        )
        .await?;
    email_account.delete_collection(app.clone()).await?;
    email_account
        .create_collection_in_typesense(app.clone())
        .await?;

    // Let's work with the Inbox folder
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.delete_collection(app.clone()).await?;
    email_account
        .create_collection_in_typesense(app.clone())
        .await
}

#[tauri::command]
pub async fn index_emails(
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
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.index_in_typesense(app).await
}

#[tauri::command]
pub async fn store_emails_in_db(
    pk: i64,
    app: AppHandle,
    db: State<'_, DwataDb>,
) -> Result<usize, DwataError> {
    let mut email_account = {
        let mut db_guard = db.lock().await;
        EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
    };
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            false,
            app.clone(),
        )
        .await?;
    email_account.store_emails_in_db(app).await
}

#[tauri::command]
pub async fn search_emails(
    pk_list: Vec<i64>,
    query: String,
    app: AppHandle,
    db: State<'_, DwataDb>,
) -> Result<SearchResult, DwataError> {
    let mut results: SearchResult = SearchResult {
        found: 0,
        hits: vec![],
    };
    for pk in pk_list {
        let mut email_account = {
            let mut db_guard = db.lock().await;
            EmailAccount::read_one_by_pk(pk, &mut db_guard).await?
        };
        email_account
            .prep_for_access(
                MailboxChoice::Inbox,
                app.path().app_data_dir().unwrap(),
                false,
                app.clone(),
            )
            .await?;
        // email_account.retrieve_collection().await?;
        let account_results = email_account
            .search_in_typesense(query.clone(), app.clone())
            .await?;
        results.found += account_results.found;
        results.hits.push(SearchCollection {
            collection_name: email_account.get_collection_name(app.clone()).await?,
            hits: account_results.hits,
        });
    }
    Ok(results)
}

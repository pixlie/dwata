use super::{EmailAccount, MailboxChoice};
use crate::error::DwataError;
use crate::workspace::crud::CRUDRead;
use crate::workspace::typesense::{SearchCollection, SearchResult, TypesenseSearchable};
use sqlx::{Pool, Sqlite};
use std::ops::Deref;
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn fetch_emails(
    pk: i64,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
) -> Result<(), DwataError> {
    let db = db.deref();
    let mut email_account = EmailAccount::read_one_by_pk(pk, db).await?;
    // Let's work with the Sent folder
    email_account
        .prep_for_access(
            MailboxChoice::Sent,
            app.path().app_data_dir().unwrap(),
            true,
            db,
        )
        .await?;
    email_account.fetch_emails(db).await?;

    // Let's work with the Inbox folder
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            true,
            db,
        )
        .await?;
    email_account.fetch_emails(db).await
}

#[tauri::command]
pub async fn create_collection_in_typesense(
    pk: i64,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
) -> Result<(), DwataError> {
    let db = db.deref();
    let mut email_account = EmailAccount::read_one_by_pk(pk, db).await?;
    // Let's work with the Sent folder
    email_account
        .prep_for_access(
            MailboxChoice::Sent,
            app.path().app_data_dir().unwrap(),
            true,
            db,
        )
        .await?;
    email_account.delete_collection(db).await?;
    email_account.create_collection_in_typesense(db).await?;

    // Let's work with the Inbox folder
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            false,
            db,
        )
        .await?;
    email_account.delete_collection(db).await?;
    email_account.create_collection_in_typesense(db).await
}

#[tauri::command]
pub async fn index_emails(
    pk: i64,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
) -> Result<(), DwataError> {
    let db = db.deref();
    let mut email_account = EmailAccount::read_one_by_pk(pk, db).await?;
    // Let's work with the Sent folder
    email_account
        .prep_for_access(
            MailboxChoice::Sent,
            app.path().app_data_dir().unwrap(),
            true,
            db,
        )
        .await?;
    email_account.index_in_typesense(db).await?;

    // Let's work with the Inbox folder
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            false,
            db,
        )
        .await?;
    email_account.index_in_typesense(db).await
}

#[tauri::command]
pub async fn store_emails_in_db(
    pk: i64,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
) -> Result<usize, DwataError> {
    let db = db.deref();
    let mut email_account = EmailAccount::read_one_by_pk(pk, db).await?;
    email_account
        .prep_for_access(
            MailboxChoice::Inbox,
            app.path().app_data_dir().unwrap(),
            false,
            db,
        )
        .await?;
    email_account.store_emails_in_db(db).await
}

#[tauri::command]
pub async fn search_emails(
    pk_list: Vec<i64>,
    query: String,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
) -> Result<SearchResult, DwataError> {
    let db = db.deref();
    let mut results: SearchResult = SearchResult {
        found: 0,
        hits: vec![],
    };
    for pk in pk_list {
        let mut email_account = EmailAccount::read_one_by_pk(pk, db).await?;
        email_account
            .prep_for_access(
                MailboxChoice::Inbox,
                app.path().app_data_dir().unwrap(),
                false,
                db,
            )
            .await?;
        // email_account.retrieve_collection().await?;
        let account_results = email_account.search_in_typesense(query.clone(), db).await?;
        results.found += account_results.found;
        results.hits.push(SearchCollection {
            collection_name: email_account.get_collection_name(db).await?,
            hits: account_results.hits,
        });
    }
    Ok(results)
}

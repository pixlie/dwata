use super::crud::InsertUpdateResponse;
use super::ModuleFilters;
use super::{
    api::{NextStep, Writable},
    crud::{CRUDCreateUpdate, ModuleDataCreateUpdate, ModuleDataReadList},
    DwataDb, Module,
};
use crate::ai_integration::AIIntegration;
use crate::chat::Chat;
use crate::database_source::DatabaseSource;
use crate::directory_source::DirectorySource;
use crate::email_account::EmailAccount;
use crate::error::DwataError;
use crate::oauth2::OAuth2;
use crate::user_account::UserAccount;
use crate::workspace::crud::{CRUDRead, ModuleDataRead};
use sqlx::SqliteConnection;
use std::ops::DerefMut;
use tauri::State;

#[tauri::command]
pub fn module_insert_or_update_initiate(module: Module) -> Result<NextStep, DwataError> {
    match module {
        Module::UserAccount => UserAccount::initiate(),
        Module::DirectorySource => DirectorySource::initiate(),
        Module::DatabaseSource => DatabaseSource::initiate(),
        Module::AIIntegration => AIIntegration::initiate(),
        Module::Chat => Chat::initiate(),
        Module::EmailAccount => EmailAccount::initiate(),
        Module::OAuth2 => OAuth2::initiate(),
    }
}

#[tauri::command]
pub async fn module_insert_or_update_next_step(
    module: Module,
    data: ModuleDataCreateUpdate,
) -> Result<NextStep, DwataError> {
    match module {
        Module::UserAccount => UserAccount::next_step(data).await,
        Module::DirectorySource => DirectorySource::next_step(data).await,
        Module::DatabaseSource => DatabaseSource::next_step(data).await,
        Module::AIIntegration => AIIntegration::next_step(data).await,
        Module::Chat => Chat::next_step(data).await,
        Module::EmailAccount => EmailAccount::next_step(data).await,
        Module::OAuth2 => OAuth2::next_step(data).await,
    }
}

#[tauri::command]
pub async fn read_row_list_for_module(
    module: Module,
    db: State<'_, DwataDb>,
) -> Result<ModuleDataReadList, DwataError> {
    let mut db_guard = db.lock().await;
    let db_connection = db_guard.deref_mut();
    match module {
        Module::UserAccount => UserAccount::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::UserAccount(result))),
        Module::DirectorySource => DirectorySource::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::DirectorySource(result))),
        Module::DatabaseSource => DatabaseSource::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::DatabaseSource(result))),
        Module::AIIntegration => AIIntegration::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::AIIntegration(result))),
        Module::Chat => Chat::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::Chat(result))),
        Module::EmailAccount => EmailAccount::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::EmailAccount(result))),
        Module::OAuth2 => OAuth2::read_all(db_connection)
            .await
            .and_then(|result| Ok(ModuleDataReadList::Oauth2(result))),
    }
}

#[tauri::command]
pub async fn read_row_list_for_module_with_filter(
    filters: ModuleFilters,
    db: State<'_, DwataDb>,
) -> Result<ModuleDataReadList, DwataError> {
    let mut db_guard = db.lock().await;
    match filters {
        ModuleFilters::AIIntegration(x) => AIIntegration::read_with_filter(x, &mut db_guard)
            .await
            .and_then(|result| Ok(ModuleDataReadList::AIIntegration(result))),
        ModuleFilters::Chat(x) => Chat::read_with_filter(x, &mut db_guard)
            .await
            .and_then(|result| Ok(ModuleDataReadList::Chat(result))),
    }
}

#[tauri::command]
pub async fn read_module_item_by_pk(
    module: Module,
    pk: i64,
    db: State<'_, DwataDb>,
) -> Result<ModuleDataRead, DwataError> {
    let mut db_guard = db.lock().await;
    let db_connection = db_guard.deref_mut();
    match module {
        Module::UserAccount => UserAccount::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::UserAccount(x))),
        Module::DirectorySource => DirectorySource::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::DirectorySource(x))),
        Module::DatabaseSource => DatabaseSource::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::DatabaseSource(x))),
        Module::AIIntegration => AIIntegration::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::AIIntegration(x))),
        Module::Chat => Chat::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::Chat(x))),
        Module::OAuth2 => OAuth2::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::OAuth2(x))),
        Module::EmailAccount => EmailAccount::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::EmailAccount(x))),
    }
}

pub async fn insert_helper(
    data: ModuleDataCreateUpdate,
    db_connection: &mut SqliteConnection,
) -> Result<InsertUpdateResponse, DwataError> {
    match data {
        ModuleDataCreateUpdate::UserAccount(x) => x.insert_module_data(db_connection).await,
        ModuleDataCreateUpdate::DirectorySource(x) => x.insert_module_data(db_connection).await,
        ModuleDataCreateUpdate::DatabaseSource(x) => x.insert_module_data(db_connection).await,
        ModuleDataCreateUpdate::AIIntegration(x) => x.insert_module_data(db_connection).await,
        ModuleDataCreateUpdate::Chat(x) => x.insert_module_data(db_connection).await,
        ModuleDataCreateUpdate::OAuth2(x) => x.insert_module_data(db_connection).await,
        ModuleDataCreateUpdate::EmailAccount(x) => x.insert_module_data(db_connection).await,
    }
}

#[tauri::command]
pub async fn insert_module_item(
    data: ModuleDataCreateUpdate,
    db: State<'_, DwataDb>,
) -> Result<InsertUpdateResponse, DwataError> {
    let mut db_guard = db.lock().await;
    insert_helper(data, &mut db_guard).await
}

pub async fn update_helper(
    pk: i64,
    data: ModuleDataCreateUpdate,
    db_connection: &mut SqliteConnection,
) -> Result<InsertUpdateResponse, DwataError> {
    match data {
        ModuleDataCreateUpdate::UserAccount(x) => x.update_module_data(pk, db_connection).await,
        ModuleDataCreateUpdate::DirectorySource(x) => x.update_module_data(pk, db_connection).await,
        ModuleDataCreateUpdate::DatabaseSource(x) => x.update_module_data(pk, db_connection).await,
        ModuleDataCreateUpdate::AIIntegration(x) => x.update_module_data(pk, db_connection).await,
        ModuleDataCreateUpdate::Chat(x) => x.update_module_data(pk, db_connection).await,
        ModuleDataCreateUpdate::OAuth2(x) => x.update_module_data(pk, db_connection).await,
        ModuleDataCreateUpdate::EmailAccount(x) => x.update_module_data(pk, db_connection).await,
    }
}

#[tauri::command]
pub async fn update_module_item(
    pk: i64,
    data: ModuleDataCreateUpdate,
    db: State<'_, DwataDb>,
) -> Result<InsertUpdateResponse, DwataError> {
    let mut db_guard = db.lock().await;
    update_helper(pk, data, &mut db_guard).await
}

#[tauri::command]
pub async fn upsert_module_item(
    pk: i64,
    data: ModuleDataCreateUpdate,
    db: State<'_, DwataDb>,
) -> Result<InsertUpdateResponse, DwataError> {
    let mut db_guard = db.lock().await;
    let db_connection = db_guard.deref_mut();
    let existing = match data {
        ModuleDataCreateUpdate::UserAccount(_) => UserAccount::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::UserAccount(x))),
        ModuleDataCreateUpdate::DirectorySource(_) => {
            DirectorySource::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::DirectorySource(x)))
        }
        ModuleDataCreateUpdate::DatabaseSource(_) => {
            DatabaseSource::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::DatabaseSource(x)))
        }
        ModuleDataCreateUpdate::AIIntegration(_) => {
            AIIntegration::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::AIIntegration(x)))
        }
        ModuleDataCreateUpdate::Chat(_) => Chat::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::Chat(x))),
        ModuleDataCreateUpdate::OAuth2(_) => OAuth2::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::OAuth2(x))),
        ModuleDataCreateUpdate::EmailAccount(_) => EmailAccount::read_one_by_pk(pk, db_connection)
            .await
            .and_then(|x| Ok(ModuleDataRead::EmailAccount(x))),
    };
    match existing {
        Ok(_) => {
            // We found an item in the DB, let us update it
            update_helper(pk, data, db_connection).await
        }
        Err(_) => {
            // We did not find an existing item, so we insert one
            insert_helper(data, db_connection).await
        }
    }
}

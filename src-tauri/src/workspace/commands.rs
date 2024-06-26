use super::crud::InsertUpdateResponse;
use super::ModuleFilters;
use super::{
    configuration::{Configurable, Configuration},
    crud::{CRUDCreateUpdate, ModuleDataCreateUpdate, ModuleDataReadList},
    DwataDb, Module,
};
use crate::ai_integration::AIIntegration;
use crate::chat::Chat;
use crate::database_source::DatabaseSource;
use crate::directory_source::DirectorySource;
use crate::error::DwataError;
use crate::user_account::UserAccount;
use crate::workspace::crud::{CRUDRead, ModuleDataRead};
use sqlx::SqliteConnection;
use std::ops::DerefMut;
use tauri::State;

#[tauri::command]
pub fn get_module_configuration(module: Module) -> Result<Configuration, DwataError> {
    match module {
        Module::UserAccount => Ok(UserAccount::get_schema()),
        Module::DirectorySource => Ok(DirectorySource::get_schema()),
        Module::DatabaseSource => Ok(DatabaseSource::get_schema()),
        Module::AIIntegration => Ok(AIIntegration::get_schema()),
        Module::Chat => Ok(Chat::get_schema()),
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

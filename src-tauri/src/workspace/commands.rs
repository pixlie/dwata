use super::{
    configuration::{Configurable, Configuration},
    crud::{CRUDHelperCreate, ModuleDataCreateUpdate, ModuleDataReadList},
    DwataDb, Module,
};
use crate::ai::AIIntegration;
use crate::database_source::DatabaseSource;
use crate::directory_source::DirectorySource;
use crate::error::DwataError;
use crate::user_account::UserAccount;
use crate::workspace::crud::{ModuleDataRead, CRUD};
use log::error;
use tauri::path::BaseDirectory::Data;
use tauri::process::restart;
use tauri::State;

#[tauri::command]
pub fn get_module_configuration(module: Module) -> Result<Configuration, DwataError> {
    match module {
        Module::UserAccount => Ok(UserAccount::get_schema()),
        Module::DirectorySource => Ok(DirectorySource::get_schema()),
        Module::DatabaseSource => Ok(DatabaseSource::get_schema()),
        Module::AIIntegration => Ok(AIIntegration::get_schema()),
    }
}

#[tauri::command]
pub async fn read_module_list(
    module: Module,
    db: State<'_, DwataDb>,
) -> Result<ModuleDataReadList, DwataError> {
    match *db.lock().await {
        Some(ref mut db_connection) => match module {
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
        },
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

#[tauri::command]
pub async fn read_module_item_by_pk(
    module: Module,
    pk: i64,
    db: State<'_, DwataDb>,
) -> Result<ModuleDataRead, DwataError> {
    match *db.lock().await {
        Some(ref mut db_connection) => match module {
            Module::UserAccount => UserAccount::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::UserAccount(x))),
            Module::DirectorySource => DirectorySource::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::Directory(x))),
            Module::DatabaseSource => DatabaseSource::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::DatabaseSource(x))),
            Module::AIIntegration => AIIntegration::read_one_by_pk(pk, db_connection)
                .await
                .and_then(|x| Ok(ModuleDataRead::AIIntegration(x))),
        },
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

#[tauri::command]
pub async fn insert_module_item(
    data: ModuleDataCreateUpdate,
    db: State<'_, DwataDb>,
) -> Result<i64, DwataError> {
    match *db.lock().await {
        Some(ref mut db_connection) => match data {
            ModuleDataCreateUpdate::UserAccount(x) => x.insert_module_data(db_connection).await,
            ModuleDataCreateUpdate::Directory(x) => x.insert_module_data(db_connection).await,
        },
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

#[tauri::command]
pub async fn upsert_module_item(
    pk: i64,
    data: ModuleDataCreateUpdate,
    db: State<'_, DwataDb>,
) -> Result<i64, DwataError> {
    let existing = match *db.lock().await {
        Some(ref mut db_connection) => match data {
            ModuleDataCreateUpdate::UserAccount(_) => {
                UserAccount::read_one_by_pk(pk, db_connection)
                    .await
                    .and_then(|x| Ok(ModuleDataRead::UserAccount(x)))
            }
            ModuleDataCreateUpdate::Directory(_) => {
                DirectorySource::read_one_by_pk(pk, db_connection)
                    .await
                    .and_then(|x| Ok(ModuleDataRead::Directory(x)))
            }
        },
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    };
    match existing {
        Ok(_) => {
            // We found an item in the DB, let us update it
            match *db.lock().await {
                Some(ref mut db_connection) => match data {
                    ModuleDataCreateUpdate::UserAccount(x) => {
                        x.update_module_data(pk, db_connection).await
                    }
                    ModuleDataCreateUpdate::Directory(x) => {
                        x.update_module_data(pk, db_connection).await
                    }
                },
                None => {
                    error!("Could not connect to Dwata DB");
                    Err(DwataError::CouldNotConnectToDwataDB)
                }
            }
        }
        Err(_) => {
            // We did not find an existing item, so we insert one
            match *db.lock().await {
                Some(ref mut db_connection) => match data {
                    ModuleDataCreateUpdate::UserAccount(x) => {
                        x.insert_module_data(db_connection).await
                    }
                    ModuleDataCreateUpdate::Directory(x) => {
                        x.insert_module_data(db_connection).await
                    }
                },
                None => {
                    error!("Could not connect to Dwata DB");
                    Err(DwataError::CouldNotConnectToDwataDB)
                }
            }
        }
    }
}

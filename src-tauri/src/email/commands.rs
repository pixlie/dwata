use super::helpers::search_emails_in_tantity_and_dwata_db;
use crate::{
    error::DwataError,
    workspace::{ModuleDataReadList, ModuleFilters},
};
use log::error;
use sqlx::{Pool, Sqlite};
use std::ops::Deref;
use tauri::{AppHandle, Manager, State};

#[tauri::command]
pub async fn search_emails(
    filters: ModuleFilters,
    app: AppHandle,
    db: State<'_, Pool<Sqlite>>,
) -> Result<ModuleDataReadList, DwataError> {
    match filters {
        ModuleFilters::Email(filters) => {
            let result = search_emails_in_tantity_and_dwata_db(
                filters,
                &app.path().app_data_dir().unwrap(),
                db.deref(),
            )
            .await?;
            Ok(ModuleDataReadList::Email(result))
        }
        _ => {
            error!("Invalid module {}", filters.to_string());
            Err(DwataError::ModuleNotFound)
        }
    }
}

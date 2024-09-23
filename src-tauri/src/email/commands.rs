use super::helpers::search_emails_in_tantity_and_dwata_db;
use crate::{
    error::DwataError,
    workspace::{ModuleDataList, ModuleDataReadList, ModuleFilters},
};
use log::error;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn search_emails(
    filters: ModuleFilters,
    limit: Option<usize>,
    offset: Option<usize>,
    app: AppHandle,
) -> Result<ModuleDataReadList, DwataError> {
    let limit = limit.unwrap_or(25);
    let offset = offset.unwrap_or(0);
    match filters {
        ModuleFilters::Email(filters) => {
            let (result, total_items) = search_emails_in_tantity_and_dwata_db(
                filters,
                limit,
                offset,
                &app.path().app_data_dir().unwrap(),
                db.deref(),
            )
            .await?;
            Ok(ModuleDataReadList {
                total_items,
                limit,
                offset,
                data: ModuleDataList::Email(result),
            })
        }
        _ => {
            error!("Invalid module {}", filters.to_string());
            Err(DwataError::ModuleNotFound)
        }
    }
}

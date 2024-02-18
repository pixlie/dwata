use super::{ColumnPath, DwataData, DwataQuery, QueryOrder};
use crate::error::DwataError;
use crate::workspace::helpers::load_config;
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn load_data(
    app_handle: AppHandle,
    select: Vec<ColumnPath>,
    ordering: Option<HashMap<u8, QueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
) -> Result<DwataData, DwataError> {
    let config_dir: PathBuf = app_handle.path().config_dir().unwrap();
    let config = load_config(&config_dir);

    let query: DwataQuery = DwataQuery {
        select,
        ordering,
        filtering,
    };
    Ok(query.get_data(config).await)
}

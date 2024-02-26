use super::{DwataQuery, SelectColumnsPath};
use crate::error::DwataError;
use crate::query_result::api_types::APIGridData;
use crate::store::Store;
use tauri::State;

#[tauri::command]
pub async fn load_data(
    select: Vec<SelectColumnsPath>,
    store: State<'_, Store>,
) -> Result<Vec<APIGridData>, DwataError> {
    let query: DwataQuery = DwataQuery { select };
    let guard = store.config.lock().await;
    Ok(query.get_data(&guard).await)
}

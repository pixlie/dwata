use super::DwataQuery;
use crate::error::DwataError;
use crate::relational_database::api_types::{APIGridData, APIGridQuery};
use crate::workspace::Store;
use tauri::State;

#[tauri::command]
pub async fn load_data(
    select: Vec<APIGridQuery>,
    store: State<'_, Store>,
) -> Result<Vec<APIGridData>, DwataError> {
    let query: DwataQuery = DwataQuery { select };
    let guard = store.config.lock().await;
    Ok(query.get_data(&guard).await)
}

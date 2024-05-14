use crate::error::DwataError;
use crate::schema::api_types::APIGridSchema;
use crate::workspace::Store;
use tauri::State;

#[tauri::command]
pub async fn read_schema(
    data_source_id: &str,
    store: State<'_, Store>,
) -> Result<Vec<APIGridSchema>, DwataError> {
    let mut schema: Vec<APIGridSchema> = vec![];
    let guard = store.config.lock().await;
    match guard.get_database_by_id(data_source_id) {
        Some(ds) => {
            let mut tables = ds.get_tables(Some(true)).await;
            schema.append(&mut tables);
            Ok(schema)
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

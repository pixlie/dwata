use super::helpers::get_schema_summary;
use crate::error::DwataError;
use crate::schema::api_types::APIGridSchema;
use crate::store::Store;
use tauri::State;

#[tauri::command]
pub async fn read_schema(
    data_source_id: &str,
    store: State<'_, Store>,
) -> Result<Vec<APIGridSchema>, DwataError> {
    let mut schema: Vec<APIGridSchema> = vec![];
    let guard = store.config.lock().await;
    match guard.get_data_source(data_source_id) {
        Some(ds) => {
            let mut tables = ds.get_tables(Some(true)).await;
            schema.append(&mut tables);
            // println!("{}", get_schema_summary(ds).await);
            Ok(schema)
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

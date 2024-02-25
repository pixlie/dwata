use super::helpers::get_schema_summary;
use crate::error::DwataError;
use crate::schema::DwataSchema;
use crate::store::Store;
use tauri::State;

#[tauri::command]
pub async fn read_schema(
    data_source_id: &str,
    store: State<'_, Store>,
) -> Result<DwataSchema, DwataError> {
    let mut schema = DwataSchema { tables: vec![] };
    let guard = store.config.lock().await;
    match guard.get_data_source(data_source_id) {
        Some(ds) => {
            let mut tables = ds.get_tables(Some(true)).await;
            schema.tables.append(&mut tables);
            println!("{}", get_schema_summary(ds).await);
            Ok(schema)
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

// pub async fn read_schema_summary(app_handle: AppHandle, data_source_id: &str) {}

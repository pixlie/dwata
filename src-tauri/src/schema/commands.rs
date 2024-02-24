use super::helpers::get_schema_summary;
use super::metadata::{get_table_columns, get_table_names};
use crate::error::DwataError;
use crate::schema::{Schema, TableSchema};
use crate::workspace::helpers::load_config;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn read_schema(
    app_handle: AppHandle,
    data_source_id: &str,
) -> Result<Schema, DwataError> {
    let config_dir: PathBuf = app_handle.path().config_dir().unwrap();
    let config = load_config(&config_dir);

    let mut schema = Schema { tables: vec![] };
    match config.get_data_source(data_source_id) {
        Some(ds) => {
            let tables = get_table_names(ds).await;
            for table_name in tables {
                let table_schema = TableSchema {
                    name: table_name.clone(),
                    columns: get_table_columns(ds, table_name.clone()).await,
                    primary_key: None,
                    foreign_keys: vec![],
                };
                schema.tables.push(table_schema);
            }
            println!("{}", get_schema_summary(ds).await);
            Ok(schema)
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

// pub async fn read_schema_summary(app_handle: AppHandle, data_source_id: &str) {}

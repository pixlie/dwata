use crate::error::DwataError;
use crate::schema::metadata::{get_table_schema, get_tables};
use crate::schema::ColumnDataType::Boolean;
use crate::schema::{Column, IsForeignKey, Schema, TableSchema};
use crate::workspace::helpers::load_config;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

fn get_column(name: &str) -> Column {
    Column {
        name: name.to_string(),
        data_type: Boolean,
        label: None,
        is_primary_key: if name == "id" { true } else { false },
        is_auto_increment: false,
        is_index: false,
        is_foreign_key: IsForeignKey::No,
    }
}

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
            let tables = get_tables(ds).await;
            for table_name in tables {
                let table_schema = TableSchema {
                    name: table_name.clone(),
                    columns: vec![],
                    primary_key: None,
                    foreign_keys: vec![],
                };
                schema.tables.push(table_schema);
                let _table_schema = get_table_schema(ds, table_name.clone()).await;
            }
            Ok(schema)
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

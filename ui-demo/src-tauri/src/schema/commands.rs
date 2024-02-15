use crate::error::DwataError;
use crate::schema::postgresql_metadata::get_table_schema;
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

    let ret = Ok(Schema {
        tables: vec![TableSchema {
            name: "products".to_string(),
            columns: vec![
                get_column("id"),
                get_column("name"),
                get_column("price"),
                get_column("description"),
                get_column("category"),
                get_column("image_url"),
            ],
            primary_key: None,
            foreign_keys: vec![],
        }],
    });

    match config.get_data_source(data_source_id) {
        Some(ds) => {
            println!("{:?}", get_table_schema(ds, "calendar").await);
            ret
        }
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

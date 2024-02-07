use crate::error::DwataError;
use crate::schema::ColumnDataType::Boolean;
use crate::schema::{Column, IsForeignKey, Schema, TableSchema};

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
pub fn load_schema() -> Result<Schema, DwataError> {
    let source_name = "__default__".to_string();
    Ok(Schema {
        sources: vec![source_name.clone()],
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
    })
}

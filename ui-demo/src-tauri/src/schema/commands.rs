use crate::error::DwataError;
use crate::schema::{Column, Schema};
use std::collections::HashMap;

fn get_column(name: &str) -> Column {
    Column {
        name: name.to_string(),
        label: None,
        is_primary_key: if name == "id" { true } else { false },
        is_auto_increment: false,
    }
}

#[tauri::command]
pub fn load_schema() -> Result<Schema, DwataError> {
    let source_name = "__default__".to_string();
    Ok(Schema {
        sources: vec![source_name.clone()],
        tables: HashMap::from([(source_name.clone(), vec!["products".to_string()])]),
        columns: HashMap::from([(
            source_name.clone(),
            HashMap::from([(
                "products".to_string(),
                vec![
                    get_column("id"),
                    get_column("name"),
                    get_column("price"),
                    get_column("description"),
                    get_column("category"),
                    get_column("image_url"),
                ],
            )]),
        )]),
    })
}

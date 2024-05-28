use super::{DirectorySource, DirectorySourceCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreateUpdate, InputValue, VecColumnNameValue, CRUD};
use chrono::Utc;

impl CRUD for DirectorySource {
    fn table_name() -> String {
        "directory_source".to_string()
    }
}

impl CRUDHelperCreateUpdate for DirectorySourceCreateUpdate {
    fn table_name() -> String {
        "directory_source".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.path {
            name_values.push_name_value("path", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.label {
            name_values.push_name_value("label", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.include_patterns {
            name_values.push_name_value("include_patterns", InputValue::Json(serde_json::json!(x)));
        }
        if let Some(x) = &self.exclude_patterns {
            name_values.push_name_value("exclude_patterns", InputValue::Json(serde_json::json!(x)));
        }
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

use super::{DirectorySource, DirectorySourceCreateUpdate};
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue};
use chrono::Utc;

impl CRUDRead for DirectorySource {
    fn table_name() -> String {
        "directory_source".to_string()
    }
}

impl CRUDCreateUpdate for DirectorySourceCreateUpdate {
    fn table_name() -> String {
        "directory_source".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.path {
            names_values.push_name_value("path", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.label {
            names_values.push_name_value("label", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.include_patterns {
            names_values
                .push_name_value("include_patterns", InputValue::Json(serde_json::json!(x)));
        }
        if let Some(x) = &self.exclude_patterns {
            names_values
                .push_name_value("exclude_patterns", InputValue::Json(serde_json::json!(x)));
        }
        names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        names_values
    }
}

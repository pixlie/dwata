use super::{DirectorySource, DirectorySourceCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, VecColumnNameValue, CRUD};
use chrono::Utc;

impl CRUD for DirectorySource {
    fn table_name() -> String {
        "directory".to_string()
    }
}

impl CRUDHelperCreate for DirectorySourceCreateUpdate {
    fn table_name() -> String {
        "directory".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        self.path.as_ref().and_then(|x| {
            name_values.push_name_value("path", InputValue::Text(x.clone()));
            Some(())
        });
        self.label.as_ref().and_then(|x| {
            name_values.push_name_value("label", InputValue::Text(x.clone()));
            Some(())
        });
        name_values.push_name_value(
            "include_patterns",
            InputValue::Json(serde_json::json!(self.include_patterns)),
        );
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

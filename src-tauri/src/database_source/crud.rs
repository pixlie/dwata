use super::{DatabaseSource, DatabaseSourceCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, VecColumnNameValue, CRUD};
use chrono::Utc;

impl CRUD for DatabaseSource {
    fn table_name() -> String {
        "directory".to_string()
    }
}

impl CRUDHelperCreate for DatabaseSourceCreateUpdate {
    fn table_name() -> String {
        "directory".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        self.label.as_ref().and_then(|x| {
            name_values.push_name_value("label", InputValue::Text(x.clone()));
            Some(())
        });
        self.name.as_ref().and_then(|x| {
            name_values.push_name_value("name", InputValue::Text(x.clone()));
            Some(())
        });
        self.database_type.as_ref().and_then(|x| {
            name_values.push_name_value("database_type", InputValue::Text(x.clone()));
            Some(())
        });
        self.database_host.as_ref().and_then(|x| {
            name_values.push_name_value("database_host", InputValue::Text(x.clone()));
            Some(())
        });
        self.database_port.as_ref().and_then(|x| {
            name_values.push_name_value("database_port", InputValue::Text(x.to_string()));
            Some(())
        });
        self.database_username.as_ref().and_then(|x| {
            name_values.push_name_value("database_username", InputValue::Text(x.clone()));
            Some(())
        });
        self.database_password.as_ref().and_then(|x| {
            name_values.push_name_value("database_password", InputValue::Text(x.clone()));
            Some(())
        });
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

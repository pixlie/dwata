use super::EmailCreateUpdate;
use crate::{
    error::DwataError,
    workspace::crud::{CRUDCreateUpdate, InputValue, VecColumnNameValue},
};

impl CRUDCreateUpdate for EmailCreateUpdate {
    fn table_name() -> String {
        "email".to_string()
    }

    fn get_column_names_values(&self) -> Result<VecColumnNameValue, DwataError> {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.from_name {
            names_values.push_name_value("from_name", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.from_email {
            names_values.push_name_value("from_email", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.date {
            names_values.push_name_value("date", InputValue::ID(*x));
        }
        if let Some(x) = &self.subject {
            names_values.push_name_value("subject", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.body_text {
            names_values.push_name_value("body_text", InputValue::Text(x.clone()));
        }
        Ok(names_values)
    }
}

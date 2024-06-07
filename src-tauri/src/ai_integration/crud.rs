use super::{AIIntegration, AIIntegrationCreateUpdate};
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue};
use chrono::Utc;

impl CRUDRead for AIIntegration {
    fn table_name() -> String {
        "ai_integration".to_string()
    }
}

impl CRUDCreateUpdate for AIIntegrationCreateUpdate {
    fn table_name() -> String {
        "ai_integration".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.label {
            name_values.push_name_value("label", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.ai_provider {
            name_values.push_name_value("ai_provider", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.api_key {
            name_values.push_name_value("api_key", InputValue::Text(x.clone()));
        }
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

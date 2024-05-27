use super::{AIIntegration, AIIntegrationCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, VecColumnNameValue, CRUD};
use chrono::Utc;

impl CRUD for AIIntegration {
    fn table_name() -> String {
        "user_account".to_string()
    }
}

impl CRUDHelperCreate for AIIntegrationCreateUpdate {
    fn table_name() -> String {
        "ai_integration".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.ai_provider {
            name_values.push_name_value("ai_provider", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.api_key {
            name_values.push_name_value("api_key", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.display_label {
            name_values.push_name_value("display_label", InputValue::Text(x.clone()));
        }
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

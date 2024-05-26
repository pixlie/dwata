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
        self.ai_provider.as_ref().and_then(|x| {
            name_values.push_name_value("ai_provider", InputValue::Text(x.clone()));
            Some(())
        });
        self.api_key.as_ref().and_then(|x| {
            name_values.push_name_value("api_key", InputValue::Text(x.clone()));
            Some(())
        });
        self.display_label.as_ref().and_then(|x| {
            name_values.push_name_value("display_label", InputValue::Text(x.clone()));
            Some(())
        });
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

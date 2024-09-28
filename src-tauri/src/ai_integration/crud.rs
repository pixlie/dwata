use super::{AIIntegration, AIIntegrationCreateUpdate, AIIntegrationFilters};
use crate::{
    error::DwataError,
    workspace::{
        crud::{CRUDCreateUpdate, CRUDRead, CRUDReadFilter, InputValue, VecColumnNameValue},
        db::DwataDB,
    },
};
use chrono::Utc;

impl CRUDRead for AIIntegration {
    fn table_name() -> String {
        "ai_integration".to_string()
    }
}

impl CRUDCreateUpdate for AIIntegration {
    type Payload = AIIntegrationCreateUpdate;

    fn table_name() -> String {
        "ai_integration".to_string()
    }

    fn get_parsed_item(
        payload: AIIntegrationCreateUpdate,
        pk: u32,
        db: &DwataDB,
    ) -> Result<Self, DwataError> {
        // let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        // if let Some(x) = &self.label {
        //     names_values.push_name_value("label", InputValue::Text(x.clone()));
        // }
        // if let Some(x) = &self.ai_provider {
        //     names_values.push_name_value("ai_provider", InputValue::Text(x.clone()));
        // }
        // if let Some(x) = &self.api_key {
        //     names_values.push_name_value("api_key", InputValue::Text(x.clone()));
        // }
        // names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        // Ok(names_values)
        Err(DwataError::ModuleNotWritable)
    }
}

impl CRUDReadFilter for AIIntegrationFilters {
    fn get_column_names_values_to_filter(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.id {
            name_values.push_name_value("id", InputValue::ID(*x));
        }
        if let Some(x) = &self.ai_provider {
            name_values.push_name_value("ai_provider", InputValue::Text(x.clone()));
        }
        name_values
    }
}

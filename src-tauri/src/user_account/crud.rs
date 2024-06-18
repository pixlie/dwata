use chrono::Utc;

use super::{UserAccount, UserAccountCreateUpdate};
use crate::workspace::crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue};

impl CRUDRead for UserAccount {
    fn table_name() -> String {
        "user_account".to_string()
    }
}

impl CRUDCreateUpdate for UserAccountCreateUpdate {
    fn table_name() -> String {
        "user_account".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.first_name {
            names_values.push_name_value("first_name", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.last_name {
            names_values.push_name_value("last_name", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.email {
            names_values.push_name_value("email", InputValue::Text(x.clone()));
        }
        names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        names_values
    }
}

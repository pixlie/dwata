use super::{UserAccount, UserAccountCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, VecColumnNameValue, CRUD};

impl CRUD for UserAccount {
    fn table_name() -> String {
        "user_account".to_string()
    }
}

impl CRUDHelperCreate for UserAccountCreateUpdate {
    fn table_name() -> String {
        "user_account".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        match &self.first_name {
            Some(x) => names_values.push_name_value("first_name", InputValue::Text(x.clone())),
            None => {}
        }
        match &self.last_name {
            Some(x) => names_values.push_name_value("last_name", InputValue::Text(x.clone())),
            None => {}
        }
        match &self.email {
            Some(x) => names_values.push_name_value("email", InputValue::Text(x.clone())),
            None => {}
        }
        names_values
    }
}

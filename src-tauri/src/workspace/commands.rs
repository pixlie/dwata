use super::configuration::{Configurable, ConfigurationSchema};
use crate::{error::DwataError, user_account::UserAccount};

#[tauri::command]
pub fn get_configuration_schema(module: &str) -> Result<ConfigurationSchema, DwataError> {
    match module {
        "UserAccount" => Ok(UserAccount::get_schema()),
        &_ => Err(DwataError::ModuleNotFound),
    }
}

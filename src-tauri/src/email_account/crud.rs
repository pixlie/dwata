use std::str::FromStr;

use super::{EmailAccount, EmailAccountCreateUpdate, EmailProvider};
use crate::{
    error::DwataError,
    oauth2::OAuth2,
    workspace::crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue},
};
use chrono::Utc;

impl CRUDRead for EmailAccount {
    fn table_name() -> String {
        "email_account".to_string()
    }
}

impl CRUDCreateUpdate for EmailAccountCreateUpdate {
    fn table_name() -> String {
        "email_account".to_string()
    }

    fn get_column_names_values(&self) -> Result<VecColumnNameValue, DwataError> {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.provider {
            names_values.push_name_value("provider", InputValue::Text(x.clone()));
            let provider = match EmailProvider::from_str(&x) {
                Ok(x) => x,
                Err(_) => return Err(DwataError::InvalidEmailProvider),
            };
            match provider {
                EmailProvider::Gmail => {
                    // The OAuth2 ID will be checked from DB in pre_insert and then added
                }
                EmailProvider::ProtonMail => {
                    if let Some(x) = &self.email_address {
                        names_values.push_name_value("email_address", InputValue::Text(x.clone()));
                    }
                    if let Some(x) = &self.password {
                        names_values.push_name_value("password", InputValue::Text(x.clone()));
                    }
                }
            }
        }

        names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        Ok(names_values)
    }

    async fn pre_insert(
        &self,
        db_connection: &mut sqlx::SqliteConnection,
    ) -> Result<VecColumnNameValue, DwataError> {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if self.provider == Some("gmail".to_string()) {
            if self.oauth2_id.is_none() {
                return Err(DwataError::CouldNotFindOAuth2Config);
            }
            match self.oauth2_id.as_ref().unwrap().parse::<i64>() {
                Ok(id) => {
                    match OAuth2::read_one_by_pk(id, db_connection).await {
                        Ok(oauth) => {
                            name_values.push_name_value("oauth2_id", InputValue::ID(oauth.id));
                            name_values.push_name_value(
                                "email_address",
                                InputValue::Text(oauth.handle.unwrap()),
                            );
                        }
                        Err(_) => return Err(DwataError::CouldNotFindOAuth2Config),
                    };
                }
                Err(_) => return Err(DwataError::CouldNotFindOAuth2Config),
            }
        }
        Ok(name_values)
    }
}

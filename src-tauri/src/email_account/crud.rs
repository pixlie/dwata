use super::{EmailAccount, EmailAccountCreateUpdate, EmailProvider, Mailbox, MailboxCreateUpdate};
use crate::{
    error::DwataError,
    oauth2::OAuth2Token,
    workspace::crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue},
};
use chrono::Utc;
use sqlx::{Pool, Sqlite};
use std::str::FromStr;

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

    async fn pre_insert(&self, db: &Pool<Sqlite>) -> Result<VecColumnNameValue, DwataError> {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if self.provider == Some("gmail".to_string()) {
            if self.oauth2_token_id.is_none() {
                return Err(DwataError::CouldNotFindOAuth2Config);
            }
            match self.oauth2_token_id.as_ref().unwrap().parse::<i64>() {
                Ok(id) => {
                    match OAuth2Token::read_one_by_pk(id, db).await {
                        Ok(oauth2_token) => {
                            name_values
                                .push_name_value("oauth2_id", InputValue::ID(oauth2_token.id));
                            name_values.push_name_value(
                                "email_address",
                                InputValue::Text(oauth2_token.handle.unwrap()),
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

impl CRUDRead for Mailbox {
    fn table_name() -> String {
        "mailbox".to_string()
    }
}

impl CRUDCreateUpdate for MailboxCreateUpdate {
    fn table_name() -> String {
        "mailbox".to_string()
    }

    fn get_column_names_values(&self) -> Result<VecColumnNameValue, DwataError> {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.email_account_id {
            names_values.push_name_value("email_account_id", InputValue::ID(*x));
        }
        if let Some(x) = &self.name {
            names_values.push_name_value("name", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.storage_path {
            names_values.push_name_value("storage_path", InputValue::Text(x.clone()));
        }

        names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        Ok(names_values)
    }
}

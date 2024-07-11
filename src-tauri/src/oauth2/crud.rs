use super::{helpers::get_google_oauth2_tokens, OAuth2, OAuth2CreateUpdate};
use crate::{
    error::DwataError,
    workspace::crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue},
};
use chrono::Utc;
use sqlx::SqliteConnection;

impl CRUDRead for OAuth2 {
    fn table_name() -> String {
        "oauth2".to_string()
    }
}

impl CRUDCreateUpdate for OAuth2CreateUpdate {
    fn table_name() -> String {
        "oauth2".to_string()
    }

    fn get_column_names_values(&self) -> Result<VecColumnNameValue, DwataError> {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.provider {
            names_values.push_name_value("provider", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.client_id {
            names_values.push_name_value("client_id", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.client_secret {
            names_values.push_name_value("client_secret", InputValue::Text(x.clone()));
        }
        names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        Ok(names_values)
    }

    async fn pre_insert(
        &self,
        _db_connection: &mut SqliteConnection,
    ) -> Result<VecColumnNameValue, DwataError> {
        if self.client_id.is_none() || self.client_secret.is_none() {
            return Err(DwataError::CouldNotFindOAuth2Config);
        }
        let oauth2_response = get_google_oauth2_tokens(
            self.client_id.as_ref().unwrap().clone(),
            self.client_secret.as_ref().unwrap().clone(),
        )
        .await?;
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        name_values.push_name_value(
            "authorization_code",
            InputValue::Text(oauth2_response.authorization_code),
        );
        name_values.push_name_value(
            "access_token",
            InputValue::Text(oauth2_response.access_token),
        );
        name_values.push_name_value(
            "refresh_token",
            InputValue::Text(oauth2_response.refresh_token.unwrap_or_default()),
        );
        name_values.push_name_value("identifier", InputValue::Text(oauth2_response.identifier));
        if let Some(x) = oauth2_response.handle {
            name_values.push_name_value("handle", InputValue::Text(x.clone()));
        }
        Ok(name_values)
    }
}

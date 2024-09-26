use super::{
    helpers::get_google_oauth2_tokens, OAuth2App, OAuth2AppCreateUpdate, OAuth2Provider,
    OAuth2Token, OAuth2TokenCreateUpdate,
};
use crate::{
    error::DwataError,
    workspace::{
        crud::{CRUDCreateUpdate, CRUDRead},
        db::DwataDB,
    },
};
use chrono::Utc;
use std::str::FromStr;

impl CRUDRead for OAuth2App {
    fn table_name() -> String {
        "oauth2_app".to_string()
    }
}

impl CRUDCreateUpdate for OAuth2App {
    type Payload = OAuth2AppCreateUpdate;

    fn table_name() -> String {
        "oauth2_app".to_string()
    }

    fn get_parsed_item(
        payload: OAuth2AppCreateUpdate,
        pk: u32,
        _db: &DwataDB,
    ) -> Result<OAuth2App, DwataError> {
        Ok(OAuth2App {
            id: pk,
            provider: payload.provider.map_or(
                Err(DwataError::invalid_field_value("provider")),
                |x| {
                    OAuth2Provider::from_str(&x)
                        .map_err(|_| DwataError::invalid_field_value("provider"))
                },
            )?,
            client_id: payload
                .client_id
                .ok_or(DwataError::invalid_field_value("client_id"))?,
            client_secret: payload.client_secret,
            created_at: Utc::now(),
            modified_at: None,
        })
    }
}

impl CRUDRead for OAuth2Token {
    fn table_name() -> String {
        "oauth2_token".to_string()
    }
}

impl CRUDCreateUpdate for OAuth2Token {
    type Payload = OAuth2TokenCreateUpdate;

    fn table_name() -> String {
        "oauth2_token".to_string()
    }

    fn get_parsed_item(
        payload: OAuth2TokenCreateUpdate,
        pk: u32,
        _db: &DwataDB,
    ) -> Result<OAuth2Token, DwataError> {
        Ok(OAuth2Token {
            id: pk,
            oauth2_app_id: payload
                .oauth2_app_id
                .ok_or(DwataError::invalid_field_value("oauth2_app_id"))?,
            authorization_code: payload
                .authorization_code
                .ok_or(DwataError::invalid_field_value("authorization_code"))?,
            access_token: payload
                .access_token
                .ok_or(DwataError::invalid_field_value("access_token"))?,
            refresh_token: payload.refresh_token,
            identifier: payload
                .identifier
                .ok_or(DwataError::invalid_field_value("identifier"))?,
            handle: payload.handle,
            created_at: Utc::now(),
            modified_at: None,
            oauth2_app: None,
        })
    }

    // async fn pre_insert(&self) -> Result<VecColumnNameValue, DwataError> {
    //     // We call the OAuth2 server and get the authorization code,
    //     // refresh token, access token, identifier etc.
    //     if self.oauth2_app_id.is_none() {
    //         return Err(DwataError::CouldNotFindOAuth2Config);
    //     }
    //     let sql = "SELECT * FROM oauth2_app WHERE id = ?";
    //     let oauth2_app: OAuth2App = query_as(sql).bind(self.oauth2_app_id).fetch_one(db).await?;
    //     let oauth2_response = get_google_oauth2_tokens(
    //         oauth2_app.client_id.clone(),
    //         oauth2_app.client_secret.as_ref().unwrap().clone(),
    //     )
    //     .await?;
    //     let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
    //     name_values.push_name_value(
    //         "authorization_code",
    //         InputValue::Text(oauth2_response.authorization_code),
    //     );
    //     name_values.push_name_value(
    //         "access_token",
    //         InputValue::Text(oauth2_response.access_token),
    //     );
    //     name_values.push_name_value(
    //         "refresh_token",
    //         InputValue::Text(oauth2_response.refresh_token.unwrap_or_default()),
    //     );
    //     name_values.push_name_value("identifier", InputValue::Text(oauth2_response.identifier));
    //     if let Some(x) = oauth2_response.handle {
    //         name_values.push_name_value("handle", InputValue::Text(x.clone()));
    //     }
    //     Ok(name_values)
    // }
}

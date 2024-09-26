use super::{EmailAccount, EmailAccountCreateUpdate, EmailProvider, Mailbox};
use crate::content::content::{Content, ContentType};
use crate::error::DwataError;
use crate::oauth2::helpers::get_google_oauth2_tokens;
use crate::oauth2::{OAuth2App, OAuth2Token, OAuth2TokenCreateUpdate};
use crate::workspace::crud::{
    CRUDCreateUpdate, CRUDRead, InputValue, InsertUpdateResponse, VecColumnNameValue,
};
use crate::workspace::db::DwataDB;
use chrono::Utc;
use std::str::FromStr;

impl CRUDRead for EmailAccount {
    fn table_name() -> String {
        "email_account".to_string()
    }
}

impl CRUDCreateUpdate for EmailAccount {
    type Payload = EmailAccountCreateUpdate;

    fn table_name() -> String {
        "email_account".to_string()
    }

    fn get_parsed_item(
        payload: EmailAccountCreateUpdate,
        pk: u32,
        _db: &DwataDB,
    ) -> Result<Self, DwataError> {
        let (provider, email_address, password, oauth2_token_id) = match payload.provider {
            Some(x) => match EmailProvider::from_str(&x) {
                Ok(provider) => match provider {
                    EmailProvider::Gmail => {
                        if payload.oauth2_app_id.is_none() {
                            return Err(DwataError::CouldNotFindOAuth2Config);
                        }
                        return Err(DwataError::InvalidEmailProvider);
                    }
                    EmailProvider::ProtonMail => (
                        EmailProvider::ProtonMail,
                        match payload.email_address {
                            Some(x) => x,
                            None => return Err(DwataError::InvalidEmailAddress),
                        },
                        match payload.password {
                            Some(x) => Some(x),
                            None => return Err(DwataError::InvalidEmailAddress),
                        },
                        None,
                    ),
                },
                Err(_) => return Err(DwataError::InvalidEmailProvider),
            },
            None => return Err(DwataError::InvalidEmailProvider),
        };
        Ok(EmailAccount {
            id: pk,
            provider,
            email_address,
            password,
            oauth2_token_id,
            created_at: Utc::now(),
            modified_at: None,
        })

        // We check if gmail is the provider and if so, we create the OAuth2 token for the OAuth2 app
        // In the OAuth2CreateUpdate, there is a pre_insert function that will call the OAuth2 server
        // and get the authorization code, refresh token, access token, identifier etc.
        // if self.provider == Some("gmail".to_string()) {
        //     let oauth2_app_id = self.oauth2_app_id.unwrap();
        //     let sql = "SELECT * FROM oauth2_app WHERE id = ?";
        //     let oauth2_app: OAuth2App = query_as(sql).bind(oauth2_app_id).fetch_one(db).await?;
        //     let oauth2_response = get_google_oauth2_tokens(
        //         oauth2_app.client_id.clone(),
        //         oauth2_app.client_secret.as_ref().unwrap().clone(),
        //     )
        //     .await?;
        //     // We check if there is an existing OAuth2 token for this OAuth2 app and identifier combination
        //     let oauth2_token_id =
        //         match OAuth2Token::read_all(25, 0, db)
        //             .await?
        //             .0
        //             .iter()
        //             .find(|token| {
        //                 token.oauth2_app_id == oauth2_app_id
        //                     && token.identifier == oauth2_response.identifier
        //                     && token.handle == oauth2_response.handle
        //             }) {
        //             Some(oauth2_token) => {
        //                 // We already have an OAuth2 token for this combination, let's update it
        //                 let updated = OAuth2TokenCreateUpdate {
        //                     refresh_token: oauth2_response.refresh_token.clone(),
        //                     access_token: Some(oauth2_response.access_token.clone()),
        //                     ..Default::default()
        //                 };
        //                 updated.update_module_data(oauth2_token.id, db).await?;
        //                 oauth2_token.id
        //             }
        //             None => {
        //                 // We did not find an existing OAuth2 token for this combination, let's create a new one
        //                 let oauth2_token_id = OAuth2TokenCreateUpdate {
        //                     authorization_code: Some(oauth2_response.authorization_code.clone()),
        //                     oauth2_app_id: Some(oauth2_app_id),
        //                     refresh_token: oauth2_response.refresh_token.clone(),
        //                     access_token: Some(oauth2_response.access_token.clone()),
        //                     identifier: Some(oauth2_response.identifier.clone()),
        //                     handle: oauth2_response.handle.clone(),
        //                 }
        //                 .insert_module_data(db)
        //                 .await?
        //                 .pk;
        //                 oauth2_token_id
        //             }
        //         };
        //     match OAuth2Token::read_one_by_key(oauth2_token_id, db).await {
        //         Ok(oauth2_token) => {
        //             name_values.push_name_value("oauth2_token_id", InputValue::ID(oauth2_token.id));
        //             name_values.push_name_value(
        //                 "email_address",
        //                 InputValue::Text(oauth2_token.handle.unwrap()),
        //             );
        //         }
        //         Err(_) => return Err(DwataError::CouldNotFindOAuth2Config),
        //     };
        // }
        // Ok(name_values)
    }

    // async fn post_insert(
    //     &self,
    //     response: InsertUpdateResponse,
    // ) -> Result<InsertUpdateResponse, DwataError> {
    //     // When we add a new Email Account, we want to fetch emails from that account
    //     // We do this by calling the fetch_emails function as the next step
    //     Ok(InsertUpdateResponse {
    //         next_task: Some("fetch_emails".to_string()),
    //         arguments: Some(vec![(
    //             "pk".to_string(),
    //             ContentType::ID,
    //             Content::ID(response.pk),
    //         )]),
    //         ..response
    //     })
    // }
}

impl CRUDRead for Mailbox {
    fn table_name() -> String {
        "mailbox".to_string()
    }
}

// impl CRUDCreateUpdate for Mailbox {
//     type Payload = MailboxCreateUpdate;

//     fn table_name() -> String {
//         "mailbox".to_string()
//     }

//     fn get_parsed_item(
//         payload: MailboxCreateUpdate,
//         pk: u32,
//         _db: &DwataDB,
//     ) -> Result<Self, DwataError> {
//         let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
//         if let Some(x) = &self.email_account_id {
//             names_values.push_name_value("email_account_id", InputValue::ID(*x));
//         }
//         if let Some(x) = &self.name {
//             names_values.push_name_value("name", InputValue::Text(x.clone()));
//         }
//         if let Some(x) = &self.storage_path {
//             names_values.push_name_value("storage_path", InputValue::Text(x.clone()));
//         }
//         if let Some(x) = &self.messages {
//             names_values.push_name_value("messages", InputValue::ID(i64::from(*x)));
//         }
//         if let Some(x) = &self.uid_next {
//             names_values.push_name_value("uid_next", InputValue::ID(i64::from(*x)));
//         }
//         if let Some(x) = &self.uid_validity {
//             names_values.push_name_value("uid_validity", InputValue::ID(i64::from(*x)));
//         }
//         if let Some(x) = &self.last_saved_email_uid {
//             names_values.push_name_value("last_saved_email_uid", InputValue::ID(i64::from(*x)));
//         }
//         if let Some(x) = &self.last_indexed_email_uid {
//             names_values.push_name_value("last_indexed_email_uid", InputValue::ID(i64::from(*x)));
//         }

//         names_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
//         Ok(names_values)
//     }
// }

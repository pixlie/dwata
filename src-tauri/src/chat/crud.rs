use super::{Chat, ChatCreateUpdate, ChatFilters};
use crate::{
    content::content::{Content, ContentType},
    error::DwataError,
    workspace::{
        crud::{
            CRUDCreateUpdate, CRUDRead, CRUDReadFilter, InputValue, InsertUpdateResponse,
            VecColumnNameValue,
        },
        ModuleFilters,
    },
};
use chrono::Utc;

impl CRUDRead for Chat {
    fn table_name() -> String {
        "chat".to_string()
    }

    fn set_default_filters() -> Option<ModuleFilters> {
        Some(ModuleFilters::Chat(ChatFilters {
            root_chat_null: Some(true),
            ..Default::default()
        }))
    }
}

impl CRUDCreateUpdate for ChatCreateUpdate {
    fn table_name() -> String {
        "chat".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.role {
            name_values.push_name_value("role", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.root_chat_id {
            name_values.push_name_value("root_chat_id", InputValue::ID(*x));
        }
        if let Some(x) = &self.message {
            name_values.push_name_value("message", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.requested_ai_model {
            name_values.push_name_value("requested_ai_model", InputValue::Text(x.clone()));
        }
        // if let Some(x)= &self.requested_content_format {
        //     name_values.push_name_value("requested_content_format", )
        // }
        name_values.push_name_value("is_system_chat", InputValue::Bool(false));
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }

    async fn post_insert(
        &self,
        response: InsertUpdateResponse,
        _db_connection: &mut sqlx::SqliteConnection,
    ) -> Result<InsertUpdateResponse, DwataError> {
        Ok(InsertUpdateResponse {
            next_task: Some("chat_with_ai".to_string()),
            arguments: Some(vec![(
                "chatId".to_string(),
                ContentType::ID,
                Content::ID(response.pk),
            )]),
            ..response
        })
    }
}

impl CRUDReadFilter for ChatFilters {
    fn get_column_names_values_to_filter(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.role {
            name_values.push_name_value("role", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.root_chat_id {
            name_values.push_name_value("root_chat_id", InputValue::ID(*x));
        }
        if let Some(true) = &self.root_chat_null {
            name_values.push_name_value("root_chat_id", InputValue::Null);
        }
        if let Some(x) = &self.requested_ai_model {
            name_values.push_name_value("requested_ai_model", InputValue::Text(x.clone()));
        }
        name_values
    }
}

// pub(crate) async fn update_reply_sent_to_ai(chat_reply_id: i64, connection: &mut SqliteConnection) {
//     query("UPDATE chat_reply SET json_data = json_set(json_data, '$.is_sent_to_ai', json('true')) WHERE id = ?1")
//     .bind(chat_reply_id)
//     .execute(connection)
//     .await.unwrap();
// }

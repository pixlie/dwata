use super::{Chat, ChatCreateUpdate};
use crate::workspace::crud::{
    CRUDHelperCreateUpdate, InputValue, InsertUpdateResponse, VecColumnNameValue, CRUD,
};
use chrono::Utc;

impl CRUD for Chat {
    fn table_name() -> String {
        "chat".to_string()
    }
}

impl CRUDHelperCreateUpdate for ChatCreateUpdate {
    fn table_name() -> String {
        "chat".to_string()
    }

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.role {
            name_values.push_name_value("role", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.previous_chat_id {
            name_values.push_name_value("previous_chat_id", InputValue::ID(*x));
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
    ) -> InsertUpdateResponse {
        InsertUpdateResponse {
            next_command: Some("generate_text_for_chat".to_string()),
            ..response
        }
    }
}

// pub(crate) async fn update_reply_sent_to_ai(chat_reply_id: i64, connection: &mut SqliteConnection) {
//     query("UPDATE chat_reply SET json_data = json_set(json_data, '$.is_sent_to_ai', json('true')) WHERE id = ?1")
//     .bind(chat_reply_id)
//     .execute(connection)
//     .await.unwrap();
// }

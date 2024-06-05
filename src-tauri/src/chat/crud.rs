use chrono::Utc;
use log::error;
use serde_json::json;
use sqlx::{query, SqliteConnection};

use crate::error::DwataError;
use crate::workspace::crud::{CRUD, CRUDHelperCreateUpdate, InputValue, VecColumnNameValue};

use super::{Chat, ChatCreateUpdate, ContentFormat};

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
        if let Some(x) = &self.message {
            name_values.push_name_value("message", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.requested_ai_model_api_name {
            name_values.push_name_value("requested_ai_model_api_name", InputValue::Text(x.clone()));
        }
        if let Some(x) = &self.previous_chat_id {
            name_values.push_name_value("previous_chat_id", InputValue::ID(*x));
        }
        // if let Some(x)= &self.requested_content_format {
        //     name_values.push_name_value("requested_content_format", )
        // }
        name_values.push_name_value("is_system_chat", InputValue::Bool(false));
        name_values.push_name_value("created_at", InputValue::DateTime(Utc::now()));
        name_values
    }
}

pub async fn create_chat(
    message: String,
    _previous_chat_id: Option<i64>,
    ai_model_id: i64,
    created_by_id: i64,
    db_connection: &mut SqliteConnection,
) -> Result<i64, DwataError> {
    // let title = message
    //     .get(
    //         ..(if message.len() >= 300 {
    //             300
    //         } else {
    //             message.len() - 1
    //         }),
    //     )
    //     .unwrap()
    //     .to_string();
    let created_at = Utc::now();

    let chat_result = query(
        r#"INSERT INTO chat_reply
        (message, requested_content_format, tool_response, is_system_chat, requested_ai_model_id, created_by_id, created_at)
        VALUES ( ?, ?, ?, ?, ?, ?, ? )"#,
    )
    .bind(message)
    .bind(Some(ContentFormat::Text))
    .bind(json!("[]"))
    .bind(false)
    .bind(ai_model_id)
    .bind(created_by_id)
    .bind(created_at.to_rfc3339().clone())
    .execute(db_connection)
    .await;
    let chat_id = match chat_result {
        Ok(result) => result.last_insert_rowid(),
        Err(err) => {
            error!(
                "Could not insert into Dwata DB::{}\nError: {}",
                "chat_reply", err
            );
            return Err(DwataError::CouldNotInsertToDwataDB);
        }
    };
    Ok(chat_id)
}

// pub(crate) async fn create_chat_reply(
//     reply_from_ai: (String, Option<Vec<ChatToolResponse>>),
//     is_system_message: bool,
//     is_to_be_sent_to_ai: bool,
//     is_sent_to_ai: bool,
//     chat_thread_id: i64,
//     created_by_id: i64,
//     connection: &mut SqliteConnection,
// ) -> Result<i64, DwataError> {
//     let chat_reply: ChatReplyJson = ChatReplyJson::new(
//         reply_from_ai.0,
//         reply_from_ai.1,
//         is_system_message,
//         is_to_be_sent_to_ai,
//         is_sent_to_ai,
//     );
//     let created_at = Utc::now();
//     let chat_reply_result = query(
//         r#"INSERT INTO chat_reply
//         (json_data, chat_thread_id, created_by_id, created_at)
//         VALUES ( ?1, ?2, ?3, ?4 )"#,
//     )
//     .bind(serde_json::to_string(&chat_reply).unwrap())
//     .bind(chat_thread_id)
//     .bind(created_by_id)
//     .bind(created_at.to_rfc3339().clone())
//     .execute(connection)
//     .await;
//     match chat_reply_result {
//         Ok(result) => Ok(result.last_insert_rowid()),
//         Err(err) => {
//             println!("Error in create_chat_reply: {:?}", err);
//             Err(DwataError::CouldNotInsertToAppDatabase)
//         }
//     }
// }
//
// pub(crate) async fn update_reply_sent_to_ai(chat_reply_id: i64, connection: &mut SqliteConnection) {
//     query("UPDATE chat_reply SET json_data = json_set(json_data, '$.is_sent_to_ai', json('true')) WHERE id = ?1")
//     .bind(chat_reply_id)
//     .execute(connection)
//     .await.unwrap();
// }

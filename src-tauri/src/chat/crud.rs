use crate::chat::ChatReplyJson;
use crate::error::DwataError;
use chrono::Utc;
use serde_json::json;
use sqlx::types::JsonValue;
use sqlx::{query, Acquire, Connection, SqliteConnection};
use sqlx_postgres::any::AnyConnectionBackend;

pub(crate) async fn create_chat_thread(
    message: String,
    ai_provider: String,
    ai_model: String,
    created_by_id: i64,
    connection: &mut SqliteConnection,
) -> Result<(i64, i64), DwataError> {
    let title = message
        .get(
            ..(if message.len() >= 300 {
                300
            } else {
                message.len() - 1
            }),
        )
        .unwrap()
        .to_string();
    let chat_thread: JsonValue = json!({
        "title": title,
        "summary": JsonValue::Null,
        "labels": [],
        "ai_provider": ai_provider,
        "ai_model": ai_model
    });
    let created_at = Utc::now();
    connection
        .transaction(|txn| {
            Box::pin(async move {
                let chat_thread_result = query(
                    r#"INSERT INTO chat_thread
                    (json_data, created_by_id, created_at)
                    VALUES ( ?1, ?2, ?3 )"#,
                )
                .bind(chat_thread)
                .bind(created_by_id)
                .bind(created_at)
                .execute(&mut **txn)
                .await;
                let chat_thread_id = match chat_thread_result {
                    Ok(result) => result.last_insert_rowid(),
                    Err(err) => {
                        println!("Error: {:?}", err);
                        return Err(DwataError::CouldNotInsertToAppDatabase);
                    }
                };
                // Create the first chat reply with the full message from user
                let chat_reply: ChatReplyJson = ChatReplyJson::new(message, false, true, false);
                let chat_reply_result = query(
                    r#"INSERT INTO chat_reply
                    (json_data, chat_thread_id, created_by_id, created_at)
                    VALUES ( ?1, ?2, ?3, ?4 )"#,
                )
                .bind(serde_json::to_string(&chat_reply).unwrap())
                .bind(chat_thread_id)
                .bind(created_by_id)
                .bind(created_at.to_rfc3339().clone())
                .execute(&mut **txn)
                .await;
                let chat_reply_id = match chat_reply_result {
                    Ok(result) => result.last_insert_rowid(),
                    Err(err) => {
                        println!("Error in create_chat_thread: {:?}", err);
                        return Err(DwataError::CouldNotInsertToAppDatabase);
                    }
                };
                Ok((chat_thread_id, chat_reply_id))
            })
        })
        .await
}

pub(crate) async fn create_chat_reply(
    message: String,
    is_system_message: bool,
    is_to_be_sent_to_ai: bool,
    is_sent_to_ai: bool,
    chat_thread_id: i64,
    created_by_id: i64,
    connection: &mut SqliteConnection,
) -> Result<i64, DwataError> {
    let chat_reply: ChatReplyJson = ChatReplyJson::new(
        message,
        is_system_message,
        is_to_be_sent_to_ai,
        is_sent_to_ai,
    );
    let created_at = Utc::now();
    let chat_reply_result = query(
        r#"INSERT INTO chat_reply
        (json_data, chat_thread_id, created_by_id, created_at)
        VALUES ( ?1, ?2, ?3, ?4 )"#,
    )
    .bind(serde_json::to_string(&chat_reply).unwrap())
    .bind(chat_thread_id)
    .bind(created_by_id)
    .bind(created_at.to_rfc3339().clone())
    .execute(connection)
    .await;
    match chat_reply_result {
        Ok(result) => Ok(result.last_insert_rowid()),
        Err(err) => {
            println!("Error in create_chat_reply: {:?}", err);
            Err(DwataError::CouldNotInsertToAppDatabase)
        }
    }
}

pub(crate) async fn update_reply_sent_to_ai(chat_reply_id: i64, connection: &mut SqliteConnection) {
    query("UPDATE chat_reply SET json_data = json_set(json_data, '$.is_sent_to_ai', json('true')) WHERE id = ?1")
    .bind(chat_reply_id)
    .execute(connection)
    .await.unwrap();
}

use crate::ai::{AiModel, AiProvider};
use crate::chat::ChatThread;
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
    connection: &mut SqliteConnection,
) -> Result<ChatThread, DwataError> {
    let title = message
        .get(
            ..(if message.len() >= 60 {
                60
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
    let created_by_id: i64 = 1;
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
                .bind(created_at.clone())
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
                let chat_reply: JsonValue = json!({
                    "chat_thread_id": chat_thread_id,
                    "message": message,
                    "is_sent_to_ai": false
                });
                match query(
                    r#"INSERT INTO chat_reply
                    (json_data, chat_thread_id, created_by_id, created_at)
                    VALUES ( ?1, ?2, ?3, ?4 )"#,
                )
                .bind(chat_reply)
                .bind(chat_thread_id)
                .bind(created_by_id)
                .bind(created_at.to_rfc3339().clone())
                .execute(&mut **txn)
                .await
                {
                    Ok(_) => Ok(ChatThread {
                        id: chat_thread_id,
                        title: title.to_string(),
                        summary: None,
                        labels: vec![],
                        ai_provider: ai_provider.to_string(),
                        ai_model: ai_model.to_string(),
                        created_by_id,
                        created_at,
                    }),
                    Err(err) => {
                        println!("Error: {:?}", err);
                        return Err(DwataError::CouldNotInsertToAppDatabase);
                    }
                }
            })
        })
        .await
}

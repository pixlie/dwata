use crate::error::DwataError;
use chrono::Utc;
use serde_json::json;
use sqlx::types::JsonValue;
use sqlx::{query, SqliteConnection};

pub(crate) async fn upsert_user_account(
    first_name: Option<&str>,
    last_name: Option<&str>,
    email: Option<&str>,
    connection: &mut SqliteConnection,
) -> Result<i64, DwataError> {
    let user_account: JsonValue = json!({
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "is_system_user": false,
        "is_ai_user": false
    });
    // See if user exists with ID 1
    let result = query("SELECT * FROM user_account WHERE id = 1")
        .fetch_optional(&mut *connection)
        .await;
    match result {
        Ok(result) => match result {
            Some(_) => {
                match query("UPDATE user_account SET json_data = ?1 WHERE id = 1")
                    .bind(user_account)
                    .execute(&mut *connection)
                    .await
                {
                    Ok(result) => Ok(result.last_insert_rowid()),
                    Err(err) => {
                        println!("Error: {:?}", err);
                        Err(DwataError::CouldNotInsertToAppDatabase)
                    }
                }
            }
            None => {
                let created_at = Utc::now();
                match query("INSERT INTO user_account (json_data, created_at) VALUES ( ?1, ?2 )")
                    .bind(user_account)
                    .bind(created_at)
                    .execute(&mut *connection)
                    .await
                {
                    Ok(result) => Ok(result.last_insert_rowid()),
                    Err(err) => {
                        println!("Error: {:?}", err);
                        Err(DwataError::CouldNotInsertToAppDatabase)
                    }
                }
            }
        },
        Err(err) => {
            println!("Error: {:?}", err);
            Err(DwataError::CouldNotConnectToDatabase)
        }
    }
}

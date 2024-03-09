use crate::error::DwataError;
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
        "email": email
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
                match query("INSERT INTO user_account (json_data) VALUES ( ?1 )")
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
        },
        Err(err) => {
            println!("Error: {:?}", err);
            Err(DwataError::CouldNotConnectToDatabase)
        }
    }
}

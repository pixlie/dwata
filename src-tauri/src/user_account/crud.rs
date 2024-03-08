use crate::error::DwataError;
use serde_json::json;
use sqlx::types::JsonValue;
use sqlx::{query, SqliteConnection};

pub(crate) async fn create_user_account(
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
    match query("INSERT INTO user_account (json_data) VALUES ( ?1 )")
        .bind(user_account)
        .execute(connection)
        .await
    {
        Ok(result) => Ok(result.last_insert_rowid()),
        Err(err) => {
            println!("Error: {:?}", err);
            Err(DwataError::CouldNotInsertToAppDatabase)
        }
    }
}

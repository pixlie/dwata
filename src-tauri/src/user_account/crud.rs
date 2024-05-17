use super::models::UserAccount;
use crate::error::DwataError;
use crate::relational_database::crud::CRUD;
use chrono::Utc;
use serde_json::json;
use sqlx::types::JsonValue;
use sqlx::{query_as, SqliteConnection};

impl CRUD for UserAccount {
    type Model = UserAccount;

    fn table_name() -> String {
        "user_account".to_string()
    }

    async fn select_one_by_pk(
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<UserAccount, sqlx::Error> {
        query_as("SELECT * FROM user_account WHERE id = ?1")
            .bind(pk)
            .fetch_one(db_connection)
            .await
    }
}

// pub(crate) async fn upsert_user_account(
//     first_name: Option<&str>,
//     last_name: Option<&str>,
//     email: Option<&str>,
//     connection: &mut SqliteConnection,
// ) -> Result<i64, DwataError> {
//     let user_account: JsonValue = json!({
//         "first_name": first_name,
//         "last_name": last_name,
//         "email": email,
//         "is_system_user": false,
//         "is_ai_user": false
//     });
//     // See if user exists with ID 1
//     let result = query("SELECT * FROM user_account WHERE id = 1")
//         .fetch_optional(&mut *connection)
//         .await;
//     match result {
//         Ok(result) => match result {
//             Some(_) => {
//                 match query("UPDATE user_account SET json_data = ?1 WHERE id = 1")
//                     .bind(user_account)
//                     .execute(&mut *connection)
//                     .await
//                 {
//                     Ok(result) => Ok(result.last_insert_rowid()),
//                     Err(err) => {
//                         println!("Error: {:?}", err);
//                         Err(DwataError::CouldNotInsertToAppDatabase)
//                     }
//                 }
//             }
//             None => {
//                 let created_at = Utc::now();
//                 match query("INSERT INTO user_account (json_data, created_at) VALUES ( ?1, ?2 )")
//                     .bind(user_account)
//                     .bind(created_at)
//                     .execute(&mut *connection)
//                     .await
//                 {
//                     Ok(result) => Ok(result.last_insert_rowid()),
//                     Err(err) => {
//                         println!("Error: {:?}", err);
//                         Err(DwataError::CouldNotInsertToAppDatabase)
//                     }
//                 }
//             }
//         },
//         Err(err) => {
//             println!("Error: {:?}", err);
//             Err(DwataError::CouldNotConnectToDatabase)
//         }
//     }
// }

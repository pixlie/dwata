use super::{UserAccount, UserAccountCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, CRUD};
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
        query_as(&format!(
            "SELECT * FROM {} WHERE id = ?1",
            Self::table_name()
        ))
        .bind(pk)
        .fetch_one(db_connection)
        .await
    }
}

impl CRUDHelperCreate for UserAccountCreateUpdate {
    fn table_name() -> String {
        "user_account".to_string()
    }

    fn get_column_names_values(&self) -> Vec<(String, InputValue)> {
        let mut names_values: Vec<(String, InputValue)> = vec![];
        match &self.first_name {
            Some(x) => names_values.push(("first_name".to_string(), InputValue::Text(x.clone()))),
            None => {}
        }
        match &self.last_name {
            Some(x) => names_values.push(("last_name".to_string(), InputValue::Text(x.clone()))),
            None => {}
        }
        match &self.email {
            Some(x) => names_values.push(("email".to_string(), InputValue::Text(x.clone()))),
            None => {}
        }
        names_values
    }
}

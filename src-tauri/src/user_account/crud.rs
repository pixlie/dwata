use super::{UserAccount, UserAccountCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, VecColumnNameValue, CRUD};
use sqlx::{query_as, SqliteConnection};

impl CRUD for UserAccount {
    type Model = UserAccount;

    fn table_name() -> String {
        "user_account".to_string()
    }

    async fn select_all(
        db_connection: &mut SqliteConnection,
    ) -> Result<Vec<UserAccount>, sqlx::Error> {
        query_as(&format!("SELECT * FROM {}", Self::table_name()))
            .fetch_all(db_connection)
            .await
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

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        match &self.first_name {
            Some(x) => names_values.push_name_value("first_name", InputValue::Text(x.clone())),
            None => {}
        }
        match &self.last_name {
            Some(x) => names_values.push_name_value("last_name", InputValue::Text(x.clone())),
            None => {}
        }
        match &self.email {
            Some(x) => names_values.push_name_value("email", InputValue::Text(x.clone())),
            None => {}
        }
        names_values
    }
}

use sqlx::{query_as, SqliteConnection};

use super::{Directory, DirectoryCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, CRUD};

impl CRUD for Directory {
    type Model = Directory;

    fn table_name() -> String {
        "directory".to_string()
    }

    async fn select_one_by_pk(
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<Directory, sqlx::Error> {
        query_as(&format!(
            "SELECT * FROM {} WHERE id = ?1",
            Self::table_name()
        ))
        .bind(pk)
        .fetch_one(db_connection)
        .await
    }
}

impl CRUDHelperCreate for DirectoryCreateUpdate {
    fn table_name() -> String {
        "directory".to_string()
    }

    fn get_column_names_values(&self) -> Vec<(String, crate::workspace::crud::InputValue)> {
        todo!()
    }
}

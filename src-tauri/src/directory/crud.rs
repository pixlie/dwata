use sqlx::{query_as, SqliteConnection};

use super::{Directory, DirectoryCreateUpdate};
use crate::workspace::crud::{CRUDHelperCreate, InputValue, VecColumnNameValue, CRUD};

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

    fn get_column_names_values(&self) -> VecColumnNameValue {
        let mut name_values: VecColumnNameValue = VecColumnNameValue::default();
        self.path.as_ref().and_then(|x| {
            name_values.push_name_value("path", InputValue::Text(format!("{}", x.display())));
            Some(())
        });
        self.label.as_ref().and_then(|x| {
            name_values.push_name_value("label", InputValue::Text(x.clone()));
            Some(())
        });
        name_values.push_name_value(
            "include_patterns",
            InputValue::Json(serde_json::json!(self.include_patterns)),
        );
        name_values
    }
}

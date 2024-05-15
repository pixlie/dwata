use sqlx::{query_as, SqliteConnection};

use crate::error::DwataError;

pub trait CRUD {
    // type InputModel;
    type Model;
    type PrimaryKey;

    fn table_name() -> String;

    // async fn create_item(data: Self::InputModel) -> Result<Self::PrimaryKey, DwataError>;

    // async fn read_list() -> Result<Vec<Self::Model>, DwataError>;

    async fn select_one_by_pk(
        pk: Self::PrimaryKey,
        db_connection: &mut SqliteConnection,
    ) -> Result<Self::Model, sqlx::Error>;

    async fn read_one_by_pk(
        pk: Self::PrimaryKey,
        db_connection: &mut SqliteConnection,
    ) -> Result<Self::Model, DwataError> {
        let result: Result<Self::Model, sqlx::Error> =
            Self::select_one_by_pk(pk, db_connection).await;
        match result {
            Ok(row) => Ok(row),
            Err(error) => {
                println!("Error: {:?}", error);
                Err(DwataError::CouldNotFetchRowsFromAppDatabase)
            }
        }
    }
}

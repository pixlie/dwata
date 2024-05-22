use crate::directory::{Directory, DirectoryCreateUpdate};
use crate::error::DwataError;
use crate::user_account::{UserAccount, UserAccountCreateUpdate};
use log::error;
use serde::{Deserialize, Serialize};
use sqlx::{Execute, QueryBuilder, Sqlite, SqliteConnection};
use ts_rs::TS;

pub trait CRUD {
    type Model;

    fn table_name() -> String;

    // fn input_field_push_bind(value: &FormFieldData, builder: &mut QueryBuilder<Sqlite>) {
    //     match value {
    //         FormFieldData::Single(Content::Text(x)) => {
    //             builder.push_bind(x.clone());
    //         }
    //         // FormFieldDataSingleOrArray::Array(x)
    //         _ => {
    //             error!(
    //                 "Unhandled value type in CRUD::input_field_push_bind {:?}",
    //                 value
    //             )
    //         }
    //     }
    // }

    // async fn create_item(data: Self::InputModel) -> Result<Self::PrimaryKey, DwataError>;

    // async fn read_list() -> Result<Vec<Self::Model>, DwataError>;

    async fn select_one_by_pk(
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<Self::Model, sqlx::Error>;

    async fn read_one_by_pk(
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<Self::Model, DwataError> {
        let result: Result<Self::Model, sqlx::Error> =
            Self::select_one_by_pk(pk, db_connection).await;
        match result {
            Ok(row) => Ok(row),
            Err(_) => Err(DwataError::CouldNotFetchRowsFromDwataDB),
        }
    }

    // async fn insert(
    //     data: FormData,
    //     db_connection: &mut SqliteConnection,
    // ) -> Result<i64, DwataError> {
    //     let mut data = data;
    //     data.insert(
    //         "created_at".to_string(),
    //         FormFieldData::Single(Content::DateTime(Utc::now())),
    //     );
    //     let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(format!(
    //         "INSERT INTO {} ({}) VALUES (",
    //         Self::table_name(),
    //         data.keys()
    //             .map(|x| x.clone())
    //             .collect::<Vec<String>>()
    //             .join(", ")
    //     ));
    //     let mut count = 0;
    //     let limit = data.len();
    //     for field in data.values() {
    //         Self::input_field_push_bind(&field, &mut builder);
    //         count += 1;
    //         if count < limit {
    //             builder.push(", ");
    //         }
    //     }
    //     builder.push(")");
    //     let executable = builder.build();
    //     let sql = &executable.sql();
    //     match executable.execute(&mut *db_connection).await {
    //         Ok(result) => Ok(result.last_insert_rowid()),
    //         Err(err) => {
    //             error!(
    //                 "Could not insert into Dwata DB, table {}:\nSQL: {}\nError: {:?}",
    //                 Self::table_name(),
    //                 sql,
    //                 err
    //             );
    //             Err(DwataError::CouldNotInsertToDwataDB)
    //         }
    //     }
    // }

    // async fn update_by_pk(
    //     pk: i64,
    //     data: FormData,
    //     db_connection: &mut SqliteConnection,
    // ) -> Result<i64, DwataError> {
    //     let mut builder: QueryBuilder<Sqlite> =
    //         QueryBuilder::new(format!("UPDATE {}", Self::table_name()));
    //     builder.push(" SET ");
    //     let mut count = 0;
    //     let limit = data.len();
    //     for (name, data) in data.iter() {
    //         builder.push(format!("{} = ", name));
    //         Self::input_field_push_bind(&data, &mut builder);
    //         count += 1;
    //         if count < limit {
    //             builder.push(", ");
    //         }
    //     }
    //     builder.push(" WHERE id = ");
    //     builder.push_bind(pk);
    //     let executable = builder.build();
    //     let sql = &executable.sql();
    //     match executable.execute(&mut *db_connection).await {
    //         Ok(_) => Ok(pk),
    //         Err(err) => {
    //             error!(
    //                 "Could not update Dwata DB, table {}:\nSQL: {}\nError: {:?}",
    //                 Self::table_name(),
    //                 sql,
    //                 err
    //             );
    //             Err(DwataError::CouldNotUpdateDwataDB)
    //         }
    //     }
    // }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub enum ModuleDataRead {
    UserAccount(UserAccount),
    Directory(Directory),
}

pub enum InputValue {
    Text(String),
}

pub trait CRUDHelperCreate {
    fn table_name() -> String;

    fn get_column_names_values(&self) -> Vec<(String, InputValue)>;

    async fn insert_module_data(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<i64, DwataError> {
        let column_names_values: Vec<(String, InputValue)> = self.get_column_names_values();
        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(format!(
            "INSERT INTO {} ({}) VALUES (",
            Self::table_name(),
            column_names_values
                .iter()
                .map(|x| x.0.clone())
                .collect::<Vec<String>>()
                .join(", ")
        ));
        let mut count = 0;
        let limit = column_names_values.len();
        for column in column_names_values {
            match column.1 {
                InputValue::Text(x) => {
                    builder.push_bind(x.clone());
                }
            }
            count += 1;
            if count < limit {
                builder.push(", ");
            }
        }
        builder.push(")");
        let executable = builder.build();
        let sql = &executable.sql();
        match executable.execute(&mut *db_connection).await {
            Ok(result) => Ok(result.last_insert_rowid()),
            Err(err) => {
                error!(
                    "Could not insert into Dwata DB, table {}:\nSQL: {}\nError: {:?}",
                    Self::table_name(),
                    sql,
                    err
                );
                Err(DwataError::CouldNotInsertToDwataDB)
            }
        }
    }

    async fn update_module_data(
        &self,
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<i64, DwataError> {
        let mut builder: QueryBuilder<Sqlite> =
            QueryBuilder::new(format!("UPDATE {} SET ", Self::table_name()));
        let column_names_values: Vec<(String, InputValue)> = self.get_column_names_values();
        let mut count = 0;
        let limit = column_names_values.len();
        for (name, data) in column_names_values {
            builder.push(format!("{} = ", name));
            match data {
                InputValue::Text(x) => {
                    builder.push_bind(x.clone());
                }
            }
            count += 1;
            if count < limit {
                builder.push(", ");
            }
        }
        builder.push(" WHERE id = ");
        builder.push_bind(pk);
        let executable = builder.build();
        let sql = &executable.sql();
        match executable.execute(&mut *db_connection).await {
            Ok(_) => Ok(pk),
            Err(err) => {
                error!(
                    "Could not update Dwata DB, table {}:\nSQL: {}\nError: {:?}",
                    Self::table_name(),
                    sql,
                    err
                );
                Err(DwataError::CouldNotUpdateDwataDB)
            }
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub enum ModuleDataCreateUpdate {
    UserAccount(UserAccountCreateUpdate),
    Directory(DirectoryCreateUpdate),
}

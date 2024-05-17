use crate::error::DwataError;
use chrono::Utc;
use log::error;
use sqlx::{Execute, QueryBuilder, Sqlite, SqliteConnection};
use std::collections::HashMap;

pub enum InputField {
    Text(String),
    Number(i64),
    Float(f64),
    DateTime(chrono::DateTime<Utc>),
}

pub type InputModel = HashMap<String, InputField>;

pub trait CRUD {
    type Model;

    fn table_name() -> String;

    fn input_field_push_bind(value: &InputField, builder: &mut QueryBuilder<Sqlite>) {
        match value {
            InputField::Text(x) => {
                builder.push_bind(x.clone());
            }
            InputField::Number(x) => {
                builder.push_bind(x.clone());
            }
            InputField::Float(x) => {
                builder.push_bind(x.clone());
            }
            InputField::DateTime(x) => {
                builder.push_bind(x.clone());
            }
        }
    }

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

    async fn insert(
        data: InputModel,
        db_connection: &mut SqliteConnection,
    ) -> Result<i64, DwataError> {
        let mut data = data;
        data.insert("created_at".to_string(), InputField::DateTime(Utc::now()));
        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(format!(
            "INSERT INTO {} ({}) VALUES (",
            Self::table_name(),
            data.keys()
                .map(|x| x.clone())
                .collect::<Vec<String>>()
                .join(", ")
        ));
        let mut count = 0;
        let limit = data.len();
        for (_, value) in data.iter() {
            Self::input_field_push_bind(value, &mut builder);
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

    async fn update_by_pk(
        pk: i64,
        data: InputModel,
        db_connection: &mut SqliteConnection,
    ) -> Result<i64, DwataError> {
        let mut builder: QueryBuilder<Sqlite> =
            QueryBuilder::new(format!("UPDATE {}", Self::table_name()));
        builder.push(" SET ");
        let mut count = 0;
        let limit = data.len();
        for (key, value) in data.iter() {
            builder.push(format!("{} = ", key));
            Self::input_field_push_bind(value, &mut builder);
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

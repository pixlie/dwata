use crate::error::DwataError;
use chrono::Utc;
use log::error;
use sqlx::{query, Execute, QueryBuilder, Sqlite, SqliteConnection};
use std::{collections::HashMap, fmt::format};

pub enum InputField {
    Text(String),
    Number(i64),
    Float(f64),
}

pub type InputModel = HashMap<String, InputField>;

pub trait CRUD {
    type Model;

    fn table_name() -> String;

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
            Err(_) => Err(DwataError::CouldNotFetchRowsFromAppDatabase),
        }
    }

    async fn insert(
        data: InputModel,
        db_connection: &mut SqliteConnection,
    ) -> Result<i64, DwataError> {
        let created_at = Utc::now();
        let mut query_builder: QueryBuilder<Sqlite> = QueryBuilder::new("INSERT INTO ");
        query_builder.push(Self::table_name());
        query_builder.push(" (");
        let mut separated = query_builder.separated(", ");
        for (key, _) in data.iter() {
            separated.push(key);
        }
        separated.push_unseparated(") VALUES (");
        for (_, value) in data.iter() {
            match value {
                InputField::Text(x) => {
                    separated.push_bind(x);
                }
                InputField::Number(x) => {
                    separated.push_bind(x);
                }
                InputField::Float(x) => {
                    separated.push_bind(x);
                }
            }
        }
        let sql = query_builder.build().sql();
        match query(sql)
            .bind(created_at)
            .execute(&mut *db_connection)
            .await
        {
            Ok(result) => Ok(result.last_insert_rowid()),
            Err(err) => {
                error!(
                    "Could not insert into Dwata DB, table {}:\nSQL: {}\nError: {:?}",
                    Self::table_name(),
                    sql,
                    err
                );
                Err(DwataError::CouldNotInsertToAppDatabase)
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
            match value {
                InputField::Text(x) => {
                    builder.push_bind(x);
                }
                InputField::Number(x) => {
                    builder.push_bind(x);
                }
                InputField::Float(x) => {
                    builder.push_bind(x);
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
                Err(DwataError::CouldNotUpdateAddDatabase)
            }
        }
    }
}

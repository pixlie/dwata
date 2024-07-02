use super::ModuleFilters;
use crate::ai_integration::{AIIntegration, AIIntegrationCreateUpdate};
use crate::chat::{Chat, ChatCreateUpdate};
use crate::content::content::{Content, ContentType};
use crate::database_source::{DatabaseSource, DatabaseSourceCreateUpdate};
use crate::directory_source::{DirectorySource, DirectorySourceCreateUpdate};
use crate::error::DwataError;
use crate::user_account::{UserAccount, UserAccountCreateUpdate};
use chrono::{DateTime, Utc};
use log::{error, info};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sqlx::sqlite::SqliteRow;
use sqlx::{query_as, Execute, FromRow, QueryBuilder, Sqlite, SqliteConnection};
use ts_rs::TS;

pub trait CRUDRead {
    fn table_name() -> String;

    fn set_default_filters() -> Option<ModuleFilters> {
        None
    }

    async fn read_all_helper(db_connection: &mut SqliteConnection) -> Result<Vec<Self>, DwataError>
    where
        Self: Sized + Send + Unpin,
        for<'r> Self: FromRow<'r, SqliteRow>,
    {
        match query_as(&format!("SELECT * FROM {}", Self::table_name()))
            .fetch_all(db_connection)
            .await
        {
            Ok(result) => {
                info!(
                    "Fetched {} rows from Dwata DBm, table {}",
                    result.len(),
                    Self::table_name()
                );
                Ok(result)
            }
            Err(err) => {
                error!(
                    "Could not fetch rows from Dwata DB, table {}.\nError: {}",
                    Self::table_name(),
                    err
                );
                Err(DwataError::CouldNotFetchRowsFromDwataDB)
            }
        }
    }

    async fn read_all(db_connection: &mut SqliteConnection) -> Result<Vec<Self>, DwataError>
    where
        Self: Sized + Send + Unpin,
        for<'r> Self: FromRow<'r, SqliteRow>,
    {
        // We check if there are default filters to apply
        let default_filters = Self::set_default_filters();
        match default_filters {
            Some(filters) => match filters {
                ModuleFilters::AIIntegration(x) => {
                    Self::read_with_filter_helper(x, db_connection).await
                }
                ModuleFilters::Chat(x) => Self::read_with_filter_helper(x, db_connection).await,
            },
            None => Self::read_all_helper(db_connection).await,
        }
    }

    async fn read_one_by_pk(
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<Self, DwataError>
    where
        Self: Sized + Send + Unpin,
        for<'r> Self: FromRow<'r, SqliteRow>,
    {
        let result: Result<Self, sqlx::Error> = query_as(&format!(
            "SELECT * FROM {} WHERE id = ?",
            Self::table_name()
        ))
        .bind(pk)
        .fetch_one(db_connection)
        .await;
        match result {
            Ok(row) => {
                info!(
                    "Fetched one row from Dwata DBm, table{}, ID {}",
                    Self::table_name(),
                    pk
                );
                Ok(row)
            }
            Err(err) => {
                error!(
                    "Could not fetch rows from Dwata DB, table {}.\nError: {}",
                    Self::table_name(),
                    err
                );
                Err(DwataError::CouldNotFetchRowsFromDwataDB)
            }
        }
    }

    async fn read_with_filter_helper<T>(
        filters: T,
        db_connection: &mut SqliteConnection,
    ) -> Result<Vec<Self>, DwataError>
    where
        Self: Sized + Send + Unpin,
        for<'r> Self: FromRow<'r, SqliteRow>,
        T: CRUDReadFilter,
    {
        let mut builder: QueryBuilder<Sqlite> =
            QueryBuilder::new(format!("SELECT * FROM {} WHERE ", Self::table_name()));
        let column_names_values: VecColumnNameValue = filters.get_column_names_values_to_filter();
        let mut count = 0;
        let limit = column_names_values.0.len();
        for (name, data) in column_names_values.0 {
            match data {
                InputValue::Null => {
                    builder.push(format!("{} IS null", name));
                }
                _ => {
                    builder.push(format!("{} = ", name));
                    match data {
                        InputValue::Text(x) => {
                            builder.push_bind(x.clone());
                        }
                        InputValue::ID(x) => {
                            builder.push_bind(x);
                        }
                        InputValue::Bool(x) => {
                            builder.push_bind(x);
                        }
                        InputValue::Json(x) => {
                            builder.push_bind(x);
                        }
                        InputValue::DateTime(x) => {
                            builder.push_bind(x);
                        }
                        _ => {}
                    }
                }
            }
            count += 1;
            if count < limit {
                builder.push(" AND ");
            }
        }
        let executable = builder.build_query_as();
        let sql = &executable.sql();
        match executable.fetch_all(&mut *db_connection).await {
            Ok(rows) => {
                info!(
                    "Fetched {} rows from Dwata DB, table {}",
                    rows.len(),
                    Self::table_name(),
                );
                Ok(rows)
            }
            Err(err) => {
                error!(
                    "Could not fetch rows from Dwata DB, table {}.\nSQL: {}\nError: {}",
                    Self::table_name(),
                    sql,
                    err
                );
                Err(DwataError::CouldNotFetchRowsFromDwataDB)
            }
        }
    }

    async fn read_with_filter<T>(
        filters: T,
        db_connection: &mut SqliteConnection,
    ) -> Result<Vec<Self>, DwataError>
    where
        Self: Sized + Send + Unpin,
        for<'r> Self: FromRow<'r, SqliteRow>,
        T: CRUDReadFilter,
    {
        Self::read_with_filter_helper(filters, db_connection).await
    }
}

pub trait CRUDReadFilter {
    fn get_column_names_values_to_filter(&self) -> VecColumnNameValue {
        VecColumnNameValue::default()
    }
}

#[derive(Serialize, TS)]
#[ts(export)]
pub enum ModuleDataRead {
    UserAccount(UserAccount),
    DirectorySource(DirectorySource),
    DatabaseSource(DatabaseSource),
    AIIntegration(AIIntegration),
    Chat(Chat),
}

#[derive(Serialize, TS)]
#[ts(export)]
pub enum ModuleDataReadList {
    UserAccount(Vec<UserAccount>),
    DirectorySource(Vec<DirectorySource>),
    DatabaseSource(Vec<DatabaseSource>),
    AIIntegration(Vec<AIIntegration>),
    Chat(Vec<Chat>),
}

pub enum InputValue {
    Text(String),
    ID(i64),
    Bool(bool),
    Json(Value),
    DateTime(DateTime<Utc>),
    Null,
}

#[derive(Default)]
pub struct VecColumnNameValue(Vec<(String, InputValue)>);

impl VecColumnNameValue {
    pub fn push_name_value(&mut self, name: &str, value: InputValue) {
        self.0.push((name.to_string(), value));
    }
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct InsertUpdateResponse {
    pub pk: i64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next_task: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub arguments: Option<Vec<(String, ContentType, Content)>>,
}

pub trait CRUDCreateUpdate {
    fn table_name() -> String;

    fn get_column_names_values(&self) -> Result<VecColumnNameValue, DwataError>;

    async fn pre_insert(&self, _db_connection: &mut SqliteConnection) -> Result<(), DwataError> {
        Ok(())
    }

    async fn insert_module_data(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<InsertUpdateResponse, DwataError> {
        // Just calling this so if it fails the error will propagate up
        self.pre_insert(db_connection).await?;
        let column_names_values: VecColumnNameValue = self.get_column_names_values()?;
        let mut builder: QueryBuilder<Sqlite> = QueryBuilder::new(format!(
            "INSERT INTO {} ({}) VALUES (",
            Self::table_name(),
            column_names_values
                .0
                .iter()
                .map(|x| x.0.clone())
                .collect::<Vec<String>>()
                .join(", ")
        ));
        let mut count = 0;
        let limit = column_names_values.0.len();
        for column in column_names_values.0 {
            match column.1 {
                InputValue::Text(x) => {
                    builder.push_bind(x.clone());
                }
                InputValue::Json(x) => {
                    builder.push_bind(x);
                }
                InputValue::DateTime(x) => {
                    builder.push_bind(x);
                }
                InputValue::ID(x) => {
                    builder.push_bind(x);
                }
                InputValue::Bool(x) => {
                    builder.push_bind(x);
                }
                _ => {}
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
            Ok(result) => {
                info!(
                    "Inserted into Dwata DB, table {}:\nSQL: {}",
                    Self::table_name(),
                    sql
                );
                self.post_insert(
                    InsertUpdateResponse {
                        pk: result.last_insert_rowid(),
                        next_task: None,
                        arguments: None,
                    },
                    db_connection,
                )
                .await
            }
            Err(err) => {
                error!(
                    "Could not insert into Dwata DB, table {}:\nSQL: {}\nError: {}",
                    Self::table_name(),
                    sql,
                    err
                );
                Err(DwataError::CouldNotInsertToDwataDB)
            }
        }
    }

    async fn post_insert(
        &self,
        response: InsertUpdateResponse,
        _db_connection: &mut SqliteConnection,
    ) -> Result<InsertUpdateResponse, DwataError> {
        Ok(response)
    }

    async fn update_module_data(
        &self,
        pk: i64,
        db_connection: &mut SqliteConnection,
    ) -> Result<InsertUpdateResponse, DwataError> {
        let mut builder: QueryBuilder<Sqlite> =
            QueryBuilder::new(format!("UPDATE {} SET ", Self::table_name()));
        let column_names_values: VecColumnNameValue = self.get_column_names_values()?;
        let mut count = 0;
        let limit = column_names_values.0.len();
        for (name, data) in column_names_values.0 {
            builder.push(format!("{} = ", name));
            match data {
                InputValue::Text(x) => {
                    builder.push_bind(x.clone());
                }
                InputValue::Json(x) => {
                    builder.push_bind(x);
                }
                InputValue::DateTime(x) => {
                    builder.push_bind(x);
                }
                InputValue::ID(x) => {
                    builder.push_bind(x);
                }
                InputValue::Bool(x) => {
                    builder.push_bind(x);
                }
                _ => {}
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
            Ok(_) => {
                info!(
                    "Updated Dwata DB, table {}:\nSQL: {}",
                    Self::table_name(),
                    sql
                );
                Ok(InsertUpdateResponse {
                    pk,
                    next_task: None,
                    arguments: None,
                })
            }
            Err(err) => {
                error!(
                    "Could not update Dwata DB, table {}:\nSQL: {}\nError: {}",
                    Self::table_name(),
                    sql,
                    err
                );
                Err(DwataError::CouldNotUpdateDwataDB)
            }
        }
    }
}

#[derive(Deserialize, TS)]
#[ts(export)]
pub enum ModuleDataCreateUpdate {
    UserAccount(UserAccountCreateUpdate),
    DirectorySource(DirectorySourceCreateUpdate),
    DatabaseSource(DatabaseSourceCreateUpdate),
    AIIntegration(AIIntegrationCreateUpdate),
    Chat(ChatCreateUpdate),
}

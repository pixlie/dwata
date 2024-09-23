use super::db::DwataDB;
use super::ModuleFilters;
use crate::content::content::{Content, ContentType};
use crate::error::DwataError;
use chrono::{DateTime, Utc};
use log::{error, info};
use serde::de::DeserializeOwned;
use serde::Serialize;
use serde_json::Value;
use ts_rs::TS;

pub trait CRUDRead {
    fn table_name() -> String;

    fn set_default_filters() -> Option<ModuleFilters> {
        None
    }

    async fn read_all_helper(limit: usize, offset: usize) -> Result<(Vec<Self>, usize), DwataError>
    where
        Self: DeserializeOwned,
    {
        match query_as(&format!(
            "SELECT * FROM {} LIMIT {} OFFSET {}",
            Self::table_name(),
            limit,
            offset
        ))
        .fetch_all(db)
        .await
        {
            Ok(result) => {
                info!(
                    "Fetched {} rows from Dwata DB, table {}",
                    result.len(),
                    Self::table_name()
                );
                // Let's find the total number of rows
                let count: i64 =
                    match query_scalar(&format!("SELECT COUNT(*) FROM {}", Self::table_name()))
                        .fetch_one(db)
                        .await
                    {
                        Ok(x) => x,
                        Err(err) => {
                            error!(
                                "Could not fetch count from Dwata DB, table {} - Error: {}",
                                Self::table_name(),
                                err
                            );
                            return Err(DwataError::CouldNotFetchRowsFromDwataDB);
                        }
                    };
                Ok((result, count as usize))
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

    async fn read_all(limit: usize, offset: usize) -> Result<(Vec<Self>, usize), DwataError>
    where
        Self: DeserializeOwned,
    {
        // We check if there are default filters to apply
        let default_filters = Self::set_default_filters();
        match default_filters {
            Some(filters) => match filters {
                ModuleFilters::AIIntegration(x) => {
                    Self::read_with_filter_helper(x, limit, offset).await
                }
                // ModuleFilters::Chat(x) => Self::read_with_filter_helper(x, limit, offset).await,
                _ => {
                    error!("Invalid module {}", filters.to_string());
                    Err(DwataError::ModuleNotFound)
                }
            },
            None => Self::read_all_helper(limit, offset).await,
        }
    }

    async fn read_one_by_key(pk: i64, db: &DwataDB) -> Result<Self, DwataError>
    where
        Self: DeserializeOwned,
    {
        let table = db.get_db(&Self::table_name(), None)?;
        match table.get(pk.to_string()) {
            Ok(item_opt) => match item_opt {
                Some(item) => match serde_json::from_slice::<Self>(&item) {
                    Ok(deserialized) => Ok(deserialized),
                    Err(err) => {
                        error!(
                            "Could not deserialize item from Dwata DB, table {}, key {}\nError: {}",
                            Self::table_name(),
                            pk,
                            err
                        );
                        Err(DwataError::CouldNotFetchSingleRowFromDwataDB)
                    }
                },
                None => {
                    error!(
                        "Could not read one item by key from Dwata DB, table {}, key {}",
                        Self::table_name(),
                        pk
                    );
                    Err(DwataError::CouldNotFetchSingleRowFromDwataDB)
                }
            },
            Err(err) => {
                error!(
                    "Could not read one item by key from Dwata DB, table {}, key {}\nError: {}",
                    Self::table_name(),
                    pk,
                    err
                );
                Err(DwataError::CouldNotFetchSingleRowFromDwataDB)
            }
        }
    }

    async fn read_with_filter_helper<T>(
        filters: T,
        limit: usize,
        offset: usize,
    ) -> Result<(Vec<Self>, usize), DwataError>
    where
        Self: DeserializeOwned,
        T: CRUDReadFilter,
    {
        // let mut builder: QueryBuilder<Sqlite> =
        //     QueryBuilder::new(format!("SELECT * FROM {} WHERE ", Self::table_name()));
        // This QueryBuilder is used to count the number of rows, without using LIMIT and OFFSET in the same query
        let mut count_builder: QueryBuilder<Sqlite> = QueryBuilder::new(format!(
            "SELECT COUNT(*) FROM {} WHERE ",
            Self::table_name()
        ));
        let column_names_values: VecColumnNameValue = filters.get_column_names_values_to_filter();
        let mut pushed_names_values = 0;
        let len_names_values = column_names_values.0.len();
        for (name, data) in column_names_values.0 {
            match data {
                InputValue::Null => {
                    builder.push(format!("{} IS null", name));
                    count_builder.push(format!("{} IS null", name));
                }
                _ => {
                    if let InputValue::IDList(x) = data {
                        builder.push(format!("{} IN (", name));
                        count_builder.push(format!("{} IN (", name));
                        builder.push_bind(
                            x.iter()
                                .map(|x| x.to_string())
                                .collect::<Vec<String>>()
                                .join(","),
                        );
                        count_builder.push_bind(
                            x.iter()
                                .map(|x| x.to_string())
                                .collect::<Vec<String>>()
                                .join(","),
                        );
                        builder.push(")");
                        count_builder.push(")");
                    } else {
                        builder.push(format!("{} = ", name));
                        count_builder.push(format!("{} = ", name));
                        match data {
                            InputValue::Text(x) => {
                                builder.push_bind(x.clone());
                                count_builder.push_bind(x.clone());
                            }
                            InputValue::ID(x) => {
                                builder.push_bind(x);
                                count_builder.push_bind(x);
                            }
                            InputValue::Bool(x) => {
                                builder.push_bind(x);
                                count_builder.push_bind(x);
                            }
                            InputValue::Json(x) => {
                                builder.push_bind(x.clone());
                                count_builder.push_bind(x);
                            }
                            InputValue::DateTime(x) => {
                                builder.push_bind(x);
                                count_builder.push_bind(x);
                            }
                            _ => {}
                        }
                    }
                }
            }
            pushed_names_values += 1;
            if pushed_names_values < len_names_values {
                builder.push(" AND ");
                count_builder.push(" AND ");
            }
        }
        builder.push(" LIMIT ");
        builder.push_bind(limit as i64);
        builder.push(" OFFSET ");
        builder.push_bind(offset as i64);
        let executable = builder.build_query_as();
        let sql = &executable.sql();
        match executable.fetch_all(db).await {
            Ok(rows) => {
                info!(
                    "Fetched {} rows from Dwata DB, table {}",
                    rows.len(),
                    Self::table_name(),
                );
                let count: i64 = match count_builder.build_query_scalar().fetch_one(db).await {
                    Ok(x) => x,
                    Err(err) => {
                        error!(
                            "Could not fetch count from Dwata DB, table {} - Error: {}",
                            Self::table_name(),
                            err
                        );
                        return Err(DwataError::CouldNotFetchRowsFromDwataDB);
                    }
                };
                Ok((rows, count as usize))
            }
            Err(err) => {
                error!(
                    "Could not fetch rows from Dwata DB, table {} - SQL: {}\nError: {}",
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
        limit: usize,
        offset: usize,
    ) -> Result<(Vec<Self>, usize), DwataError>
    where
        Self: Sized + Send,
        T: CRUDReadFilter,
    {
        Self::read_with_filter_helper(filters, limit, offset).await
    }
}

pub trait CRUDReadFilter {
    fn get_column_names_values_to_filter(&self) -> VecColumnNameValue {
        VecColumnNameValue::default()
    }
}

#[derive(Clone)]
pub enum InputValue {
    Text(String),
    ID(i64),
    IDList(Vec<i64>),
    Bool(bool),
    Json(Value),
    DateTime(DateTime<Utc>),
    Null,
}

#[derive(Default)]
pub struct VecColumnNameValue(pub Vec<(String, InputValue)>);

impl VecColumnNameValue {
    pub fn push_name_value(&mut self, name: &str, value: InputValue) {
        self.0.push((name.to_string(), value));
    }

    pub fn find_by_name(&self, name: &str) -> Option<InputValue> {
        self.0
            .iter()
            .find_map(|(x, y)| if x == name { Some(y.clone()) } else { None })
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

    async fn pre_insert(&self) -> Result<VecColumnNameValue, DwataError> {
        Ok(VecColumnNameValue::default())
    }

    async fn insert_module_data(&self, db: &DwataDB) -> Result<InsertUpdateResponse, DwataError> {
        let column_names_values: VecColumnNameValue = self.get_column_names_values()?;
        let other_column_names_values: VecColumnNameValue = self.pre_insert().await?;
        let column_names_values = VecColumnNameValue {
            0: [column_names_values.0, other_column_names_values.0].concat(),
        };
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
        match executable.execute(db).await {
            Ok(result) => {
                if Self::table_name() != "process_log" {
                    info!(
                        "Inserted into Dwata DB, table {}:\nSQL: {}",
                        Self::table_name(),
                        sql
                    );
                }
                self.post_insert(
                    InsertUpdateResponse {
                        pk: result.last_insert_rowid(),
                        next_task: None,
                        arguments: None,
                    },
                    db,
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
        _db: &DwataDB,
    ) -> Result<InsertUpdateResponse, DwataError> {
        Ok(response)
    }

    async fn update_module_data(
        &self,
        pk: i64,
        db: &DwataDB,
    ) -> Result<InsertUpdateResponse, DwataError> {
        // let mut builder: QueryBuilder<Sqlite> =
        //     QueryBuilder::new(format!("UPDATE {} SET ", Self::table_name()));
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
        match executable.execute(db).await {
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

use crate::relational_database::api_types::APIGridQuery;
use crate::schema::postgresql::metadata::get_postgres_columns;
use crate::schema::postgresql::PostgreSQLColumn;
use serde_json::{Number, Value};
use sqlx::postgres::PgRow;
use sqlx::Row;
use std::collections::HashMap;

pub struct PostgreSQLQueryBuilder {
    grid: APIGridQuery,
}

impl PostgreSQLQueryBuilder {
    pub fn new(grid: &APIGridQuery) -> Self {
        PostgreSQLQueryBuilder { grid: grid.clone() }
    }

    pub fn get_select(&self) -> String {
        let mut sql: String = "SELECT ".to_string();
        let (schema, table) = self.grid.get_schema_and_table_names(None);
        sql += format!(
            "{} FROM {}.{} LIMIT 10",
            self.grid.get_columns().join(", "),
            schema,
            table
        )
        .as_str();
        sql
    }

    async fn get_column_types(
        &self,
        connection: &sqlx::PgPool,
    ) -> HashMap<(String, String), Vec<PostgreSQLColumn>> {
        let mut column_types: HashMap<(String, String), Vec<PostgreSQLColumn>> = HashMap::new();
        for _column_name in &self.grid.get_columns() {
            let (schema, table) = self.grid.get_schema_and_table_names(None);
            column_types.insert(
                (schema.clone(), table.clone()),
                get_postgres_columns(connection, schema, table).await,
            );
        }
        column_types
    }

    pub async fn get_data(&self, connection: &sqlx::PgPool) -> Vec<Vec<Value>> {
        let column_types = self.get_column_types(connection).await;
        let select = self.get_select().clone();

        sqlx::query(&select)
            .map(|pg_row: PgRow| {
                let mut data_row: Vec<Value> = vec![];
                for column_name in &self.grid.get_columns() {
                    let opt_column_def =
                        match column_types.get(&self.grid.get_schema_and_table_names(None)) {
                            Some(vec_of_columns) => vec_of_columns
                                .iter()
                                .find(|x| x.is_column_named(column_name.clone())),
                            None => None,
                        };
                    match opt_column_def {
                        Some(column_def) => {
                            let data_type = column_def.get_data_type();
                            let cell = match data_type.as_str() {
                                "integer" => {
                                    match pg_row.try_get::<Option<i32>, &str>(column_name.as_str())
                                    {
                                        Ok(x_opt) => match x_opt {
                                            Some(x) => Value::Number(Number::from(x)),
                                            None => Value::Null,
                                        },
                                        Err(_) => Value::Null,
                                    }
                                }
                                "character varying" | "text" => {
                                    match pg_row.try_get::<Option<&str>, &str>(column_name.as_str())
                                    {
                                        Ok(x_opt) => match x_opt {
                                            Some(x) => Value::String(x.to_string()),
                                            None => Value::Null,
                                        },
                                        Err(_) => Value::Null,
                                    }
                                }
                                "boolean" => {
                                    match pg_row.try_get::<Option<bool>, &str>(column_name.as_str())
                                    {
                                        Ok(x_opt) => match x_opt {
                                            Some(x) => Value::Bool(x),
                                            None => Value::Null,
                                        },
                                        Err(_) => Value::Null,
                                    }
                                }
                                _ => Value::Null,
                            };
                            data_row.push(cell);
                        }
                        None => {}
                    }
                }
                data_row
            })
            .fetch_all(connection)
            .await
            .unwrap_or_else(|_| vec![])
    }
}

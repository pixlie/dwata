use crate::query_result::{DwataQuery, SelectColumnsPath};
use crate::schema::postgresql::metadata::get_postgres_columns;
use crate::schema::postgresql::PostgreSQLColumn;
use sqlx::postgres::PgRow;
use sqlx::Row;
use std::collections::HashMap;

pub struct PostgreSQLQueryBuilder {
    data_source_id: String,
    columns: Vec<SelectColumnsPath>, // To track which column_paths we are getting results for
}

impl PostgreSQLQueryBuilder {
    pub fn new(query: &DwataQuery, data_source_id: String) -> Self {
        let mut builder = PostgreSQLQueryBuilder {
            data_source_id: data_source_id.clone(),
            columns: vec![],
        };
        // Find all columns (and tables) that are in this data source
        for column_path in &query.select {
            if column_path.source == data_source_id {
                builder.columns.push(column_path.clone());
            }
        }
        builder
    }

    pub fn get_select(&self) -> String {
        let mut sql: String = "SELECT ".to_string();
        for column_path in &self.columns {
            let (schema, table) = column_path.get_schema_and_table_names(None);
            sql += format!(
                "{} FROM {}.{}",
                column_path.get_columns().join(", "),
                schema,
                table
            )
            .as_str();
        }
        sql
    }

    async fn get_column_types(
        &self,
        connection: &sqlx::PgPool,
    ) -> HashMap<(String, String), Vec<PostgreSQLColumn>> {
        let mut column_types: HashMap<(String, String), Vec<PostgreSQLColumn>> = HashMap::new();
        for column_path in &self.columns {
            let (schema, table) = column_path.get_schema_and_table_names(None);
            column_types.insert(
                (schema.clone(), table.clone()),
                get_postgres_columns(connection, schema, table).await,
            );
        }
        column_types
    }

    pub async fn get_data(&self, connection: &sqlx::PgPool) -> Vec<Vec<String>> {
        let column_types = self.get_column_types(connection).await;
        let select = self.get_select().clone();

        sqlx::query(&select)
            .map(|pg_row: PgRow| {
                let mut data_row: Vec<String> = vec![];
                for column_path in &self.columns {
                    for column_name in column_path.get_columns() {
                        let opt_column_def =
                            match column_types.get(&column_path.get_schema_and_table_names(None)) {
                                Some(vec_of_columns) => vec_of_columns
                                    .iter()
                                    .find(|x| x.is_column_named(column_name.clone())),
                                None => None,
                            };
                        match opt_column_def {
                            Some(column_def) => {
                                let data_type = column_def.get_data_type();
                                data_row.push(match data_type.as_str() {
                                    "integer" => format!(
                                        "{:?}",
                                        pg_row
                                            .try_get::<Option<i32>, &str>(column_name.as_str())
                                            .unwrap()
                                            .unwrap()
                                    ),
                                    "character varying" => format!(
                                        "{:?}",
                                        pg_row
                                            .try_get::<Option<&str>, &str>(column_name.as_str())
                                            .unwrap()
                                            .unwrap()
                                    ),
                                    "boolean" => format!(
                                        "{:?}",
                                        pg_row
                                            .try_get::<Option<bool>, &str>(column_name.as_str())
                                            .unwrap()
                                            .unwrap()
                                    ),
                                    "text" => format!(
                                        "{:?}",
                                        pg_row
                                            .try_get::<Option<&str>, &str>(column_name.as_str())
                                            .unwrap()
                                            .unwrap()
                                    ),
                                    _ => "".to_string(),
                                })
                            }
                            None => {}
                        }
                    }
                }
                data_row
            })
            .fetch_all(connection)
            .await
            .unwrap_or_else(|_| vec![])
    }
}

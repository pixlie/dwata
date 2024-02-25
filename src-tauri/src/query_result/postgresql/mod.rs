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
        for (table, columns) in &self.select {
            sql += format!("{} FROM {}", columns.join(", "), table).as_str();
        }
        sql
    }

    async fn get_column_types(
        &self,
        connection: &sqlx::PgPool,
    ) -> HashMap<(String, String), Vec<PostgreSQLColumn>> {
        let mut column_types: HashMap<String, Vec<PostgreSQLColumn>> = HashMap::new();
        for (table, _columns) in &self.select {
            column_types.insert(
                table.clone(),
                get_postgres_columns(connection, table.clone()).await,
            );
        }
        column_types
    }

    pub async fn get_data(
        &self,
        connection: &sqlx::PgPool,
        data_by_row: &mut Vec<Vec<String>>,
        requested_column_paths: &Vec<SelectColumnsPath>,
    ) {
        let column_types = self.get_column_types(connection).await;
        let select = self.get_select().clone();
        let mut row_index = 0;

        sqlx::query(&select)
            .map(|pg_row: PgRow| {
                for column_path in &self.columns {
                    let column_index = requested_column_paths
                        .iter()
                        .position(|c| *c == column_path.clone())
                        .unwrap();
                    let column_name = column_path.columns.clone();
                    let opt_column_def = match column_types.get(&column_path.table) {
                        Some(vec_of_columns) => vec_of_columns
                            .iter()
                            .find(|x| x.is_column_named(column_name.clone())),
                        None => None,
                    };
                    match opt_column_def {
                        Some(column_def) => {
                            let data_type = column_def.get_data_type();
                            let data = match data_type.as_str() {
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
                            };
                            if let Some(row) = data_by_row.get_mut(row_index) {
                                // Existing row in the total data grid from all sources, lets insert column data in correct place
                                if let Some(cell) = row.get_mut(column_index) {
                                    *cell = data;
                                }
                            } else {
                                // New row
                                // Let's create an empty row with fills
                                let mut row: Vec<String> =
                                    vec!["".to_string(); requested_column_paths.len()];
                                if let Some(cell) = row.get_mut(column_index) {
                                    *cell = data;
                                }
                                data_by_row.push(row);
                            }
                        }
                        None => {}
                    }
                }
                row_index += 1;
            })
            .fetch_all(connection)
            .await
            .unwrap_or_else(|_| vec![]);
    }
}

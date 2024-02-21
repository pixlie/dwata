use super::{postgresql, Column};
use crate::data_sources::{DataSource, DataSourceConnection};

pub async fn get_table_columns(data_source: &DataSource, table_name: String) -> Vec<Column> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            let columns = postgresql::metadata::get_postgres_columns(&pg_pool, table_name).await;
            columns
                .iter()
                .map(|column| column.get_generic_column())
                .collect()
        }
        _ => vec![],
    }
}

pub async fn get_table_names(data_source: &DataSource) -> Vec<String> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            let db_objects = postgresql::metadata::get_postgres_objects(&pg_pool).await;
            db_objects
                .iter()
                .filter(|item| item.filter_table())
                .map(|item| item.get_name())
                .collect()
        }
        _ => {
            vec![]
        }
    }
}

use super::{postgresql, DwataColumn, DwataTable};
use crate::data_sources::{DataSource, DataSourceConnection};

pub async fn get_table_columns(data_source: &DataSource, table: &DwataTable) -> Vec<DwataColumn> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            let columns = postgresql::metadata::get_postgres_columns(&pg_pool, table).await;
            columns
                .iter()
                .map(|column| column.get_generic_column())
                .collect()
        }
        _ => vec![],
    }
}

pub async fn get_tables(data_source: &DataSource) -> Vec<DwataTable> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            let db_objects = postgresql::metadata::get_postgres_objects(&pg_pool).await;
            db_objects
                .iter()
                .filter(|item| item.filter_table())
                .collect()
        }
        _ => {
            vec![]
        }
    }
}

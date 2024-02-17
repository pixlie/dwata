use crate::data_sources::{DataSource, DataSourceConnection};
use crate::error::DwataError;
use crate::schema::{postgresql_metadata, TableSchema};

pub async fn get_table_schema(
    data_source: &DataSource,
    table_name: String,
) -> Result<TableSchema, DwataError> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            postgresql_metadata::get_postgres_table_schema(&pg_pool, table_name).await
        }
        _ => Err(DwataError::CouldNotConnectToDatabase),
    }
}

pub async fn get_tables(data_source: &DataSource) -> Vec<String> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            let db_objects = postgresql_metadata::get_postgres_objects(&pg_pool).await;
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

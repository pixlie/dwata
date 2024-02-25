use super::{postgresql, DwataColumn, DwataTable};
use crate::data_sources::{DataSource, DataSourceConnection};
use crate::schema::postgresql::PostgreSQLObject;

pub async fn get_table_columns(data_source: &DataSource, table: &DwataTable) -> Vec<DwataColumn> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            let columns = postgresql::metadata::get_postgres_columns(
                &pg_pool,
                table.get_schema_name(),
                table.get_name(),
            )
            .await;
            columns
                .iter()
                .map(|column| column.get_generic_column())
                .collect()
        }
        _ => vec![],
    }
}

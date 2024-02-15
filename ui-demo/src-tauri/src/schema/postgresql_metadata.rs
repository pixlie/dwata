use crate::data_sources::{DataSource, DataSourceConnection};
use crate::error::DwataError;
use crate::schema::TableSchema;
use sqlx::Row;

// pub fn estimated_row_count() -> usize {
//     let sql = r#"
//     SELECT reltuples FROM pg_class WHERE oid = ('"' || $1::text || '"."' || $2::text || '"')::regclass
//     "#;
// }

pub async fn get_postgres_table_schema(
    connection: &sqlx::PgPool,
    table_name: &str,
) -> Result<TableSchema, DwataError> {
    let table_schema: TableSchema = TableSchema {
        name: table_name.to_string(),
        columns: vec![],
        primary_key: None,
        foreign_keys: vec![],
    };
    let sql = r#"
    SELECT column_name, data_type, is_nullable, character_maximum_length, character_set_catalog, column_default,
    pg_catalog.col_description(('"' || $1::text || '"."' || $2::text || '"')::regclass::oid, ordinal_position) as comment
    FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2
    "#;
    match sqlx::query(sql)
        .bind("public")
        .bind(table_name)
        .fetch_all(connection)
        .await
    {
        Ok(results) => {
            for row in results {
                println!("{:?}", row.try_get(0));
            }
            Ok(table_schema)
            // Err(DwataError::CouldNotQueryDatabase)
        }
        Err(_) => Err(DwataError::CouldNotQueryDatabase),
    }
}

pub async fn get_table_schema(
    data_source: &DataSource,
    table_name: &str,
) -> Result<TableSchema, DwataError> {
    match data_source.get_connection().await {
        Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
            get_postgres_table_schema(&pg_pool, table_name).await
        }
        _ => Err(DwataError::CouldNotConnectToDatabase),
    }
}

pub async fn get_postgres_objects(connection: &sqlx::PgPool) {
    /// Taken from https://github.com/sosedoff/pgweb/blob/master/pkg/statements/sql/objects.sql
    let sql = r#"
    WITH all_objects AS (
      SELECT
        c.oid,
        n.nspname AS schema,
        c.relname AS name,
        CASE c.relkind
          WHEN 'r' THEN 'table'
          WHEN 'v' THEN 'view'
          WHEN 'm' THEN 'materialized_view'
          WHEN 'i' THEN 'index'
          WHEN 'S' THEN 'sequence'
          WHEN 's' THEN 'special'
          WHEN 'f' THEN 'foreign_table'
        END AS type,
        pg_catalog.pg_get_userbyid(c.relowner) AS owner,
        pg_catalog.obj_description(c.oid) AS comment
      FROM
        pg_catalog.pg_class c
      LEFT JOIN
        pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE
        c.relkind IN ('r','v','m','S','s','')
        AND n.nspname !~ '^pg_(toast|temp)'
        AND n.nspname NOT IN ('information_schema', 'pg_catalog')
        AND has_schema_privilege(n.nspname, 'USAGE')

      UNION

      SELECT
        p.oid,
        n.nspname AS schema,
        p.proname AS name,
        'function' AS function,
        pg_catalog.pg_get_userbyid(p.proowner) AS owner,
        NULL AS comment
      FROM
        pg_catalog.pg_namespace n
      JOIN
        pg_catalog.pg_proc p ON p.pronamespace = n.oid
      WHERE
        n.nspname !~ '^pg_(toast|temp)'
        AND n.nspname NOT IN ('information_schema', 'pg_catalog')
    )
    SELECT * FROM all_objects
    ORDER BY 2, 3
    "#;
}

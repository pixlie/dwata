use crate::error::DwataError;
use crate::schema::TableSchema;

// pub fn estimated_row_count() -> usize {
//     let sql = r#"
//     SELECT reltuples FROM pg_class WHERE oid = ('"' || $1::text || '"."' || $2::text || '"')::regclass
//     "#;
// }

pub fn get_table_schema(table_name: String) -> Result<TableSchema, DwataError> {
    let mut table_schema: TableSchema = TableSchema {
        name: table_name,
        columns: vec![],
        primary_key: None,
        foreign_keys: vec![],
    };
    let sql = r#"
    SELECT column_name, data_type, is_nullable, character_maximum_length, character_set_catalog, column_default,
    pg_catalog.col_description(('"' || $1::text || '"."' || $2::text || '"')::regclass::oid, ordinal_position) as comment
    FROM information_schema.columns WHERE table_schema = $1 AND table_name = $2
    "#;
    Ok(table_schema)
}

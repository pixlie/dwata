use crate::data_sources::DataSource;
use crate::schema::metadata::get_table_columns;

pub async fn get_schema_summary(data_source: &DataSource) -> String {
    let mut summary: String = "".to_string();
    let tables = data_source.get_tables(None).await;
    for table in tables {
        let this_table: String = format!(
            "- `{}` table with columns: ({})",
            table.get_name(),
            get_table_columns(data_source, &table)
                .await
                .iter()
                .map(|col| format!("`{}`", col.name.clone()))
                .collect::<Vec<String>>()
                .join(", ")
        );
        summary = format!("{}\n{}", summary, this_table);
    }
    summary
}

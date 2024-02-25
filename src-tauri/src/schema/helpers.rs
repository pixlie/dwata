use crate::data_sources::DataSource;
use crate::schema::metadata::{get_table_columns, get_tables};

pub async fn get_schema_summary(data_source: &DataSource) -> String {
    let mut summary: String = "".to_string();
    let tables = get_tables(data_source).await;
    for table in tables {
        let this_table: String = format!(
            "- `{}` table with columns: ({})",
            table.name,
            get_table_columns(data_source, table.clone())
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

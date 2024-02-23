use crate::data_sources::DataSource;
use crate::schema::metadata::{get_table_columns, get_table_names};

pub async fn get_schema_summary(data_source: &DataSource) -> String {
    let mut summary: String = "".to_string();
    let tables = get_table_names(data_source).await;
    for table_name in tables {
        let this_table: String = format!(
            "- `{}` table with columns: ({})",
            table_name,
            get_table_columns(data_source, table_name.clone())
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

use crate::data_sources::DataSource;

pub async fn get_schema_summary(data_source: &DataSource) -> String {
    let mut summary: String = "".to_string();
    let tables = data_source.get_tables(None).await;
    for mut table in tables {
        let columns = table.get_columns(data_source).await;
        let this_table: String = format!(
            "- `{}` table with columns: ({})",
            table.get_name(),
            columns
                .iter()
                .map(|col| format!("`{}`", col.get_name()))
                .collect::<Vec<String>>()
                .join(", ")
        );
        summary = format!("{}\n{}", summary, this_table);
    }
    summary
}

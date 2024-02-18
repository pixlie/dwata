use crate::error::DwataError;
use crate::query_result::{ColumnPath, Data, Query, QueryAndData};
use crate::sample_data;

#[tauri::command]
pub fn load_data() -> Result<QueryAndData, DwataError> {
    // Read the CSV file with sample data and respond as QueryResult
    let mut csv = csv::ReaderBuilder::new().from_reader(sample_data::DATA_PRODUCTS.as_bytes());
    let headers = csv.headers().unwrap().clone();
    let rows = csv.records();

    let result: QueryAndData = QueryAndData {
        query: Query::default(),
        data: Data {
            columns: headers
                .iter()
                .map(|x| ColumnPath {
                    column_name: x.to_string(),
                    table_name: "products".to_string(),
                    data_source_id: "__default__".to_string(),
                })
                .collect(),
            rows: rows
                .map(|row| {
                    row.unwrap()
                        .iter()
                        .map(|cell| cell.to_string())
                        .collect::<Vec<String>>()
                })
                .collect(),
        },
        errors: vec![],
    };

    let sql = "SELECT ";

    Ok(result)
}

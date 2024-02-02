use crate::error::DwataError;
use crate::query_result::{ColumnSpec, QueryResult, QueryResultData};
use crate::sample_data;

#[tauri::command]
pub fn load_data() -> Result<QueryResult, DwataError> {
    // Read the CSV file with sample data and respond as QueryResult
    let mut csv = csv::ReaderBuilder::new().from_reader(sample_data::DATA_PRODUCTS.as_bytes());
    let headers = csv.headers().unwrap().clone();
    let rows = csv.records();

    let result: QueryResult = QueryResult {
        data: QueryResultData {
            columns: headers
                .iter()
                .map(|x| {
                    ColumnSpec(
                        x.to_string(),
                        "products".to_string(),
                        "__default__".to_string(),
                    )
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
    Ok(result)
}

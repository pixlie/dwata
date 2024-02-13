use crate::data_sources::{DataSource, Database};
use crate::error::DwataError;
use crate::sample_data;

#[tauri::command]
pub fn load_data_sources() -> Result<Vec<DataSource>, DwataError> {
    // Read the CSV file with sample data and respond as Vec<DataSource>
    // let dir = app_handle.path().resource_dir().unwrap();
    let mut csv = csv::ReaderBuilder::new().from_reader(sample_data::DATA_SOURCES.as_bytes());
    Ok(csv
        .deserialize()
        .map(|result| result.unwrap())
        .collect::<Vec<DataSource>>())
}

pub fn get_databases() -> Vec<Database> {
    let mut databases: Vec<Database> = vec![];
    let sql = r#"
    SELECT datname FROM pg_database WHERE NOT datistemplate ORDER BY datname ASC
    "#;
    databases
}

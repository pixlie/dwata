use crate::data_sources::DataSource;
use crate::error::DwataError;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn load_data_sources(app_handle: AppHandle) -> Result<Vec<DataSource>, DwataError> {
    // Read the CSV file with sample data and respond as Vec<DataSource>
    let dir = app_handle.path().resource_dir().unwrap();
    let mut csv = csv::Reader::from_path(dir.join("resources/data_sources.csv")).unwrap();
    Ok(csv
        .deserialize()
        .map(|result| result.unwrap())
        .collect::<Vec<DataSource>>())
}
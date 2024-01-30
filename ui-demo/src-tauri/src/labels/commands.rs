use crate::labels::Label;
use crate::error::DwataError;
use crate::sample_data;

#[tauri::command]
pub fn load_labels() -> Result<Vec<Label>, DwataError> {
    // Read the CSV file with sample data and respond as Vec<DataSource>
    // let dir = app_handle.path().resource_dir().unwrap();
    let mut csv = csv::ReaderBuilder::new().from_reader(sample_data::LABELS.as_bytes());
    Ok(csv
        .deserialize()
        .map(|result| result.unwrap())
        .collect::<Vec<Label>>())
}
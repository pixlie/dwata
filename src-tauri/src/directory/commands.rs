use super::models::{Directory, File};
use crate::content::containers::HeterogeneousContentArray;
use crate::content::form::{FormData, FormFieldData};
use crate::error::DwataError;
use crate::workspace::crud::CRUD;
use crate::workspace::DwataDb;
use log::error;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub async fn create_directory_source(
    path: &str,
    label: Option<&str>,
    include_patterns: Vec<&str>,
    // exclude_patterns: Vec<&str>,
    db: State<'_, DwataDb>,
) -> Result<i64, DwataError> {
    let mut form_data: FormData = FormData::new();
    form_data.insert("path".to_string(), FormFieldData::from_string(path));
    if label.is_some() {
        form_data.insert(
            "label".to_string(),
            FormFieldData::from_string(label.unwrap()),
        );
    }
    form_data.insert(
        "include_patterns".to_string(),
        FormFieldData::from_array_of_string(include_patterns),
    );
    match *(db.lock().await) {
        Some(ref mut db_connection) => Directory::insert(form_data, db_connection).await,
        None => Err(DwataError::CouldNotConnectToDatabase),
    }
}

#[tauri::command]
pub(crate) async fn fetch_files_in_directory(
    directory_id: i64,
    db: State<'_, DwataDb>,
) -> Result<Vec<File>, DwataError> {
    let mut db_guard = db.lock().await;
    match *db_guard {
        Some(ref mut db_connection) => {
            // Find the Directory matching the given folder_id
            match Directory::read_one_by_pk(directory_id, db_connection).await {
                Ok(directory) => Ok(directory.get_file_list()),
                Err(x) => Err(x),
            }
        }
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

#[tauri::command]
pub(crate) async fn fetch_file_contents(
    directory_id: i64,
    relative_file_path: &str,
    db: State<'_, DwataDb>,
) -> Result<HeterogeneousContentArray, DwataError> {
    let mut db_guard = db.lock().await;
    match *db_guard {
        Some(ref mut db_connection) => {
            // Find the Directory matching the given folder_id
            match Directory::read_one_by_pk(directory_id, db_connection).await {
                Ok(directory) => {
                    // We assume we are reading Markdown files only
                    // We parse Markdown file with comrak and extract headings and paragraphs only
                    // Find the FolderSource matching the given folder_id
                    let full_path: PathBuf = directory.path.join(relative_file_path);
                    if full_path.exists() {
                        Ok(Directory::get_file_contents(&full_path))
                    } else {
                        Err(DwataError::CouldNotOpenFolder)
                    }
                }
                Err(x) => Err(x),
            }
        }
        None => {
            error!("Could not connect to Dwata DB");
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

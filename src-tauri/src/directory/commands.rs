use crate::directory::helpers::get_file_contents;
use crate::directory::{Content, FileNode};
use crate::error::DwataError;
use crate::store::Store;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub(crate) async fn fetch_file_list_in_directory(
    directory_id: &str,
    store: State<'_, Store>,
) -> Result<Vec<FileNode>, DwataError> {
    let config = store.config.lock().await;
    // Find the FolderSource matching the given folder_id
    match config.find_directory(directory_id.to_string()) {
        Some(folder) => Ok(folder.get_file_list()),
        None => Err(DwataError::CouldNotOpenFolder),
    }
}

#[tauri::command]
pub(crate) async fn fetch_file_contents(
    directory_id: &str,
    relative_file_path: &str,
    store: State<'_, Store>,
) -> Result<Vec<(usize, Content)>, DwataError> {
    // We assume we are reading Markdown files only
    // We parse Markdown file with comrak and extract headings and paragraphs only
    let config = store.config.lock().await;
    // Find the FolderSource matching the given folder_id
    match config.find_directory(directory_id.to_string()) {
        Some(directory) => {
            let full_path: PathBuf = directory.get_path().join(relative_file_path);
            if full_path.exists() {
                Ok(get_file_contents(&full_path))
            } else {
                Err(DwataError::CouldNotOpenFolder)
            }
        }
        None => Err(DwataError::CouldNotOpenFolder),
    }
}

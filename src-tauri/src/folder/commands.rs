use crate::error::DwataError;
use crate::store::Store;
use tauri::State;

#[tauri::command]
pub(crate) async fn fetch_file_list_in_folder(
    folder_id: &str,
    store: State<'_, Store>,
) -> Result<Vec<String>, DwataError> {
    let config = store.config.lock().await;
    // Find the FolderSource matching the given folder_id
    match config.find_folder(folder_id.to_string()) {
        Some(folder) => Ok(folder.get_file_list()),
        None => Err(DwataError::CouldNotOpenFolder),
    }
}

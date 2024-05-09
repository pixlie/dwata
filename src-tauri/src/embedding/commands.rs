use crate::ai::helpers::get_embedding_from_ai_provider;
use crate::directory::helpers::get_file_contents;
use crate::directory::Content;
use crate::error::DwataError;
use crate::store::Store;
use crate::workspace::helpers::load_ai_integration;
use std::path::PathBuf;
use tauri::State;

#[tauri::command]
pub(crate) async fn generate_text_embedding(
    directory_id: &str,
    relative_file_path: &str,
    store: State<'_, Store>,
) -> Result<(), DwataError> {
    let config_guard = store.config.lock().await;
    // Find the FolderSource matching the given folder_id
    match config_guard.find_directory(directory_id.to_string()) {
        Some(folder) => {
            let file_path: PathBuf = folder.get_path().join(relative_file_path);
            if file_path.exists() {
                match load_ai_integration(&config_guard, "OpenAI") {
                    Some(ai_integration) => {
                        // We filter only Content::Paragraph enum type and extract the string
                        let file_contents: Vec<(usize, Content)> = get_file_contents(&file_path);
                        for part in file_contents {
                            match part.1 {
                                Content::Paragraph(text) => {
                                    match get_embedding_from_ai_provider(
                                        &ai_integration,
                                        "text-embedding-3-small".to_string(),
                                        text,
                                    )
                                    .await
                                    {
                                        Ok(embedding) => {
                                            println!("{}", embedding.len());
                                        }
                                        Err(_) => break,
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                    None => {
                        println!("Could not load ai integration");
                    }
                }
                Ok(())
            } else {
                Err(DwataError::CouldNotOpenFolder)
            }
        }
        None => Err(DwataError::CouldNotOpenFolder),
    }
}

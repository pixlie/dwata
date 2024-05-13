use crate::ai::helpers::get_embedding_from_ai_provider;
use crate::directory::helpers::get_file_contents;
use crate::directory::Content;
use std::collections::HashSet;
// use crate::embedding::fastembed::get_embeddings_with_fastembed;
use crate::embedding::storage::{create_collection_in_qdrant, store_embedding_in_qdrant};
use crate::embedding::{ParagraphExtractMethods, ParagraphId};
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
    let mut config_guard = store.config.lock().await;
    let embeddings_storage_exists = match create_collection_in_qdrant(&mut config_guard).await {
        Ok(_) => true,
        Err(_) => {
            return Err(DwataError::CouldNotConnectToDatabase);
        }
    };
    // Find the FolderSource matching the given folder_id
    match config_guard.find_directory(directory_id.to_string()) {
        Some(folder) => {
            let file_path: PathBuf = folder.get_path().join(relative_file_path);
            if file_path.exists() {
                match load_ai_integration(&config_guard, "OpenAI") {
                    Some(ai_integration) => {
                        // We filter only Content::Paragraph enum type and extract the string
                        let file_contents: Vec<(usize, Content)> = get_file_contents(&file_path);
                        for (index, part) in file_contents.iter().enumerate() {
                            match &part.1 {
                                Content::Paragraph(text) => {
                                    match get_embedding_from_ai_provider(
                                        &ai_integration,
                                        "text-embedding-3-small".to_string(),
                                        text.clone(),
                                    )
                                    .await
                                    {
                                        Ok(embedding) => {
                                            println!("{}", embedding.len());
                                            // We serialize this file path and also store the paragraph index
                                            let text_id_struct = ParagraphId {
                                                file_path: file_path.clone(),
                                                index,
                                                extract_methods: HashSet::from([
                                                    ParagraphExtractMethods::JoinShortSiblings(255),
                                                    ParagraphExtractMethods::IgnoreHeadings,
                                                ]),
                                            };
                                            let text_id =
                                                serde_json::to_string(&text_id_struct).unwrap();
                                            if embeddings_storage_exists {
                                                store_embedding_in_qdrant(text_id, embedding)
                                                    .await?;
                                            }
                                        }
                                        Err(_) => break,
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                    None => {
                        println!("Could not load AI integration");
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

// pub(crate) async fn generate_text_embedding_with_fastembed(
//     directory_id: &str,
//     relative_file_path: &str,
//     store: State<'_, Store>,
// ) -> Result<(), DwataError> {
//     let config_guard = store.config.lock().await;
//     // Find the FolderSource matching the given folder_id
//     match config_guard.find_directory(directory_id.to_string()) {
//         Some(folder) => {
//             let file_path: PathBuf = folder.get_path().join(relative_file_path);
//             if file_path.exists() {
//                 // We filter only Content::Paragraph enum type and collect all the strings
//                 let file_contents: Vec<(usize, Content)> = get_file_contents(&file_path);
//                 let mut paragraphs: Vec<String> = vec![];
//                 for part in file_contents {
//                     match part.1 {
//                         Content::Paragraph(text) => {
//                             paragraphs.push(text);
//                         }
//                         _ => {}
//                     }
//                 }
//                 match get_embeddings_with_fastembed(paragraphs) {
//                     Ok(embedding) => {
//                         println!("{}", embedding.len());
//                     }
//                     Err(_) => {}
//                 }
//                 Ok(())
//             } else {
//                 Err(DwataError::CouldNotOpenFolder)
//             }
//         }
//         None => Err(DwataError::CouldNotOpenFolder),
//     }
// }

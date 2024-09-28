// use super::{AIIntegration, AIProvider};
// use crate::{error::DwataError, workspace::crud::CRUDRead};
// use log::error;

// #[tauri::command]
// pub async fn get_ai_model_choice_list(
//     usable_only: Option<bool>,
// ) -> Result<Vec<(String, String)>, DwataError> {
//     let mut result: Vec<AIModel> = vec![];
//     if let Some(false) = usable_only {
//         // We load all the AI models
//         result.extend(AIModel::get_all_models().await);
//     } else {
//         // We load all the AI providers that are usable
//         let (ai_integrations, _total_items) = AIIntegration::read_all(25, 0).await?;
//         for ai_integration in ai_integrations {
//             match ai_integration.ai_provider {
//                 AIProvider::OpenAI => result.extend(AIModel::get_models_for_openai()),
//                 AIProvider::Groq => result.extend(AIModel::get_models_for_groq()),
//                 AIProvider::Ollama => match AIModel::get_models_for_ollama().await {
//                     Ok(models) => result.extend(models),
//                     Err(err) => {
//                         error!("Could not get Ollama models\n Error: {}", err);
//                     }
//                 },
//             }
//         }
//     }

//     Ok(result
//         .iter()
//         .map(|x| {
//             (
//                 format!(
//                     "{}/{}",
//                     x.ai_provider.clone().to_string(),
//                     x.api_name.clone()
//                 ),
//                 format!(
//                     "{} - {}",
//                     x.ai_provider.clone().to_string(),
//                     x.label.clone()
//                 ),
//             )
//         })
//         .collect())
// }

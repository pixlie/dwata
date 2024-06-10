use log::error;
use tokio::task::spawn_blocking;

use crate::error::DwataError;

use super::models::AIModel;

#[tauri::command]
pub async fn get_ai_model_list(_usable_only: Option<bool>) -> Result<Vec<AIModel>, DwataError> {
    Ok(AIModel::get_all_models().await)
}

#[tauri::command]
pub async fn get_ai_model_choice_list(
    _usable_only: Option<bool>,
) -> Result<Vec<(String, String)>, DwataError> {
    let mut result: Vec<AIModel> = vec![];
    result.extend(AIModel::get_models_for_openai());
    result.extend(AIModel::get_models_for_groq());
    result.extend(AIModel::get_models_for_anthropic());
    match AIModel::get_models_for_ollama().await {
        Ok(models) => result.extend(models),
        Err(err) => {
            error!("Could not get Ollama models\n Error: {}", err);
        }
    }
    result.extend(AIModel::get_models_for_mistral());
    Ok(result
        .iter()
        .map(|x| {
            (
                format!(
                    "{}::{}",
                    x.ai_provider.clone().to_string(),
                    x.api_name.clone()
                ),
                x.label.clone(),
            )
        })
        .collect())
}

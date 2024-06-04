use crate::error::DwataError;

use super::models::AIModel;

#[tauri::command]
pub fn get_list_of_ai_models(_usable_only: Option<bool>) -> Result<Vec<AIModel>, DwataError> {
    let mut result: Vec<AIModel> = vec![];
    result.extend(AIModel::get_models_for_openai());
    result.extend(AIModel::get_models_for_groq());
    result.extend(AIModel::get_models_for_anthropic());
    result.extend(AIModel::get_models_for_ollama());
    result.extend(AIModel::get_models_for_mistral());
    Ok(result)
}

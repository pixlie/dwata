use crate::ai::api_types::APIAIProvider;
use crate::ai::get_ai_models;
use crate::error::DwataError;

#[tauri::command]
pub(crate) async fn fetch_list_of_ai_providers_and_models() -> Result<Vec<APIAIProvider>, DwataError>
{
    let all_ai_models = get_ai_models();
    Ok(all_ai_models
        .iter()
        .map(|(k, v)| APIAIProvider::new(k.clone(), v))
        .collect())
}

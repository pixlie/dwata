use crate::ai::api_types::APIAIProvider;
use crate::ai::get_ai_models;
use crate::error::DwataError;

#[tauri::command]
pub async fn create_ai_integration(
    ai_provider: &str,
    api_key: &str,
    display_label: Option<&str>,
    store: State<'_, Store>,
) -> Result<String, DwataError> {
    let ai_integration = AIIntegration::new(ai_provider, api_key, display_label);
    let id = ai_integration.get_id().clone();
    let mut config_guard = store.config.lock().await;
    config_guard.ai_integration_list.push(ai_integration);
    match fs::write(
        &config_guard.path_to_config,
        config_guard.get_pretty_string(),
    ) {
        Ok(_) => Ok(id),
        Err(error) => {
            println!("{:?}", error);
            Err(DwataError::CouldNotWriteConfig)
        }
    }
}

#[tauri::command]
pub async fn update_ai_integration(
    id: &str,
    ai_provider: &str,
    api_key: &str,
    display_label: Option<&str>,
    store: State<'_, Store>,
) -> Result<String, DwataError> {
    let mut config_guard = store.config.lock().await;
    match config_guard
        .ai_integration_list
        .iter_mut()
        .find(|x| x.get_id() == id)
    {
        Some(ai_integration) => {
            ai_integration.update(ai_provider, api_key, display_label);
        }
        None => {}
    }
    match fs::write(
        &config_guard.path_to_config,
        config_guard.get_pretty_string(),
    ) {
        Ok(_) => Ok(id.to_string()),
        Err(error) => {
            println!("{:?}", error);
            Err(DwataError::CouldNotWriteConfig)
        }
    }
}

#[tauri::command]
pub(crate) async fn fetch_list_of_ai_providers_and_models() -> Result<Vec<APIAIProvider>, DwataError>
{
    let all_ai_models = get_ai_models();
    Ok(all_ai_models
        .iter()
        .map(|(k, v)| APIAIProvider::new(k.clone(), v))
        .collect())
}

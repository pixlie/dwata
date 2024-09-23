use super::OAuth2App;
use crate::error::DwataError;
use crate::workspace::crud::CRUDRead;

#[tauri::command]
pub async fn get_oauth2_app_choice_list() -> Result<Vec<(String, String)>, DwataError> {
    let (all_oauth2_apps, _) = OAuth2App::read_all(25, 0).await?;
    Ok(all_oauth2_apps
        .iter()
        .map(|x| (format!("{}", x.id), format!("{}", x.provider.to_string())))
        .collect())
}

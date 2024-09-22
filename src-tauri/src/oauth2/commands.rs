use super::OAuth2App;
use crate::error::DwataError;
use crate::workspace::crud::CRUDRead;
use std::ops::Deref;
use tauri::State;

#[tauri::command]
pub async fn get_oauth2_app_choice_list() -> Result<Vec<(String, String)>, DwataError> {
    let db = db.deref();
    let (all_oauth2_apps, _) = OAuth2App::read_all(25, 0, db).await?;
    Ok(all_oauth2_apps
        .iter()
        .map(|x| (format!("{}", x.id), format!("{}", x.provider.to_string())))
        .collect())
}

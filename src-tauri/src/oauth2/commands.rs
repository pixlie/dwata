use super::OAuth2;
use crate::error::DwataError;
use crate::workspace::{crud::CRUDRead, DwataDb};
use tauri::State;

#[tauri::command]
pub async fn get_oauth2_choice_list(
    db: State<'_, DwataDb>,
) -> Result<Vec<(String, String)>, DwataError> {
    let mut db_guard = db.lock().await;
    let all_oauth2_configs: Vec<OAuth2> = OAuth2::read_all(&mut db_guard).await?;
    Ok(all_oauth2_configs
        .iter()
        .map(|x| {
            (
                format!("{}", x.id),
                format!("{}", x.handle.as_ref().unwrap_or(&x.identifier.clone())),
            )
        })
        .collect())
}

#[tauri::command]
pub async fn refetch_google_access_token(
    pk: i64,
    store: State<'_, DwataDb>,
) -> Result<(), DwataError> {
    let mut db_guard = store.lock().await;
    let oauth2: OAuth2 = OAuth2::read_one_by_pk(pk, &mut db_guard).await?;
    oauth2.refetch_google_access_token(&mut db_guard).await?;
    Ok(())
}

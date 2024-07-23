use crate::error::DwataError;

use super::{
    crud::{CRUDCreateUpdate, CRUDRead, InputValue, VecColumnNameValue},
    AppUpdatesCreateUpdate, DwataDb, ProcessLog,
};
use log::error;
use sqlx::{query, query_as};
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use tokio::time::interval;

impl CRUDRead for ProcessLog {
    fn table_name() -> String {
        "app_updates".to_string()
    }
}

impl CRUDCreateUpdate for AppUpdatesCreateUpdate {
    fn table_name() -> String {
        "app_updates".to_string()
    }

    fn get_column_names_values(&self) -> Result<VecColumnNameValue, DwataError> {
        let mut names_values: VecColumnNameValue = VecColumnNameValue::default();
        if let Some(x) = &self.process {
            names_values.push_name_value("task", InputValue::Text(x.to_string()));
        }
        if let Some(x) = &self.arguments {
            names_values.push_name_value("arguments", InputValue::Json(serde_json::json!(x)));
        }
        if let Some(x) = &self.status {
            names_values.push_name_value("status", InputValue::Text(x.to_string()));
        }
        if let Some(x) = &self.is_sent_to_frontend {
            names_values.push_name_value("is_sent_to_frontend", InputValue::Bool(*x));
        }
        Ok(names_values)
    }
}

#[tauri::command]
pub async fn get_app_updates(app: AppHandle) {
    let mut interval = interval(Duration::from_secs(1));
    loop {
        interval.tick().await;
        // Let's read the app_updates table and send any pending updates to the frontend
        let updates = {
            let db = app.state::<DwataDb>();
            let mut db_guard = db.lock().await;
            let sql = "SELECT * FROM app_updates WHERE is_sent_to_frontend = 0";
            query_as::<_, ProcessLog>(sql)
                .fetch_all(&mut *db_guard)
                .await
        };
        match updates {
            Ok(updates) => {
                let db = app.state::<DwataDb>();
                let mut db_guard = db.lock().await;
                for update in updates.iter() {
                    // We send the update to the frontend
                    app.emit("app_updates", update).unwrap();
                    // Update the is_sent_to_frontend column
                    let sql = "UPDATE app_updates SET is_sent_to_frontend = 1 WHERE id = ?";
                    query(sql)
                        .bind(update.id)
                        .execute(&mut *db_guard)
                        .await
                        .unwrap();
                }
            }
            Err(err) => {
                error!("Could not read app updates\n Error: {}", err);
            }
        }
    }
}

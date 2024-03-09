// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::SqliteConnection;
use std::future::Future;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::{App, Manager};
use tokio::sync::Mutex;

mod data_sources;
mod error;
// mod labels;
mod query_result;

mod chat;
// mod saved_query;
mod ai;
mod schema;
mod store;
mod user_account;
mod workspace;

fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(debug_assertions)] // only include this code on debug builds
    {
        let window = app.get_webview_window("main").unwrap();
        window.open_devtools();
        window.close_devtools();
    }
    let app_config_dir: PathBuf = app.path().app_config_dir().unwrap();
    let db_connection: Option<SqliteConnection> = tauri::async_runtime::block_on(async {
        store::database::get_database_connection(&app_config_dir).await
    });
    app.manage(store::Store {
        config: Arc::new(Mutex::new(workspace::helpers::load_config(&app_config_dir))),
        db_connection: Mutex::new(db_connection),
    });
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(setup)
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            workspace::commands::read_config,
            // labels::commands::load_labels,
            schema::commands::read_schema,
            query_result::commands::load_data,
            workspace::commands::create_data_source,
            // workspace::commands::create_ai_integration
            user_account::commands::save_user,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

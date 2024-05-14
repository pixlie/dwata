// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use sqlx::SqliteConnection;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::{App, Manager};
use tokio::sync::Mutex;

mod data_sources;
mod error;
// mod labels;
mod chat;
mod query_result;
// mod saved_query;
mod ai;
mod directory;
mod embedding;
mod schema;
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
        workspace::helpers::get_database_connection(&app_config_dir).await
    });
    app.manage(workspace::Store {
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
            workspace::commands::create_database_source,
            workspace::commands::create_folder_source,
            workspace::commands::create_ai_integration,
            workspace::commands::update_ai_integration,
            user_account::commands::save_user,
            user_account::commands::fetch_current_user,
            chat::commands::start_chat_thread,
            chat::commands::fetch_chat_thread_list,
            chat::commands::fetch_chat_thread_detail,
            chat::commands::fetch_chat_reply_list,
            chat::commands::fetch_chat_context_node_list,
            chat::commands::fetch_chat_context,
            ai::commands::fetch_list_of_ai_providers_and_models,
            directory::commands::fetch_file_list_in_directory,
            directory::commands::fetch_file_contents,
            embedding::commands::generate_text_embedding,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

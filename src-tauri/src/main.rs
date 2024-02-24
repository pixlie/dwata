// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod data_sources;
mod error;
mod labels;
mod query_result;

mod chat;
mod saved_query;
mod schema;
mod workspace;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            workspace::commands::read_config,
            // labels::commands::load_labels,
            schema::commands::read_schema,
            query_result::commands::load_data,
            workspace::commands::create_data_source,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod data_sources;
mod error;

use data_sources::commands::load_data_sources;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            load_data_sources,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

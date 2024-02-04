// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod data_sources;
mod error;
mod labels;
mod query_result;
mod sample_data;
mod schema;

use crate::data_sources::commands::load_data_sources;
use crate::labels::commands::load_labels;
use crate::query_result::commands::load_data;
use crate::schema::commands::load_schema;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            load_data_sources,
            load_labels,
            load_schema,
            load_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

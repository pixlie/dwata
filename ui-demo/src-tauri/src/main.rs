// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod data_sources;
mod error;
mod labels;
mod query_result;
mod sample_data;
mod schema;
mod workspace;

use crate::labels::commands::load_labels;
use crate::query_result::commands::load_data;
use crate::schema::commands::read_schema;
use crate::workspace::commands::{create_data_source, read_config};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            read_config,
            load_labels,
            read_schema,
            load_data,
            create_data_source,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod data_sources;
mod error;
mod labels;
mod sample_data;

use crate::data_sources::commands::load_data_sources;
use crate::labels::commands::load_labels;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![load_data_sources, load_labels,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

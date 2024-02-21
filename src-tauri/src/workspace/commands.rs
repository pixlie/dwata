use crate::data_sources::helpers::check_database_connection;
use crate::data_sources::{DataSource, Database};
use crate::error::DwataError;
use crate::workspace::helpers::{load_config, load_config_file};
use crate::workspace::Config;
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn create_data_source(
    app_handle: AppHandle,
    _database_type: Option<&str>,
    username: &str,
    password: Option<&str>,
    host: &str,
    port: Option<&str>,
    database: &str,
) -> Result<String, DwataError> {
    let config_dir: PathBuf = app_handle.path().config_dir().unwrap();
    let config_file_path = load_config_file(&config_dir);
    let mut config: Config = load_config(&config_dir);
    match check_database_connection(username, password, host, port, database).await {
        Ok(_) => {
            let database: Database = Database::new(username, password, host, port, database);
            let data_source: DataSource = DataSource::new_database(database, None);
            let id = data_source.get_id();
            config.data_source_list.push(data_source);
            fs::write(
                &config_file_path,
                ron::ser::to_string_pretty(&config, ron::ser::PrettyConfig::default()).unwrap(),
            )
            .unwrap();
            Ok(id)
        }
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub fn read_config(app_handle: AppHandle) -> Result<Config, DwataError> {
    let config_dir: PathBuf = app_handle.path().config_dir().unwrap();
    Ok(load_config(&config_dir))
}

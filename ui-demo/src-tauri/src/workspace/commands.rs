use crate::data_sources::helpers::check_database_connection;
use crate::data_sources::{DataSource, Database};
use crate::error::DwataError;
use crate::workspace::Config;
use std::fs;
use std::path::Path;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn add_data_source(
    app_handle: AppHandle,
    username: &str,
    password: Option<&str>,
    host: &str,
    port: Option<&str>,
    database: &str,
) -> Result<String, DwataError> {
    let mut config_file_path = app_handle.path().config_dir().unwrap();
    config_file_path.push("dwata");
    if Path::new(&config_file_path).try_exists().is_err() {
        fs::create_dir(&config_file_path).unwrap();
    }
    config_file_path.push("default.ron");
    let mut config: Config = match fs::read_to_string(&config_file_path) {
        Ok(content) => ron::from_str(content.as_str()).unwrap(),
        Err(_) => Config {
            data_source_list: vec![],
            folder_list: vec![],
        },
    };
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

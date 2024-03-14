use crate::workspace::Config;
use std::fs;
use std::path::{Path, PathBuf};

pub fn load_config(app_config_dir: &PathBuf) -> Config {
    if Path::new(&app_config_dir).try_exists().is_err() {
        fs::create_dir(&app_config_dir).unwrap();
    }

    let mut config_file_path = app_config_dir.clone();
    config_file_path.push("default.ron");
    let config: Config = match fs::read_to_string(&config_file_path) {
        Ok(content) => ron::from_str(content.as_str()).unwrap(),
        Err(_) => Config {
            path_to_config: app_config_dir.clone(),
            data_source_list: vec![],
            folder_list: vec![],
            ai_integration_list: vec![],
        },
    };
    config
}

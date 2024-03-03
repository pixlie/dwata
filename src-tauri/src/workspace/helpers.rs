use crate::workspace::Config;
use std::fs;
use std::path::{Path, PathBuf};

pub fn load_config_file(config_dir: &PathBuf) -> PathBuf {
    let mut config_file_path = config_dir.clone();
    config_file_path.push("dwata");
    if Path::new(&config_file_path).try_exists().is_err() {
        fs::create_dir(&config_file_path).unwrap();
    }
    config_file_path.push("default.ron");
    config_file_path
}

pub fn load_config(config_dir: &PathBuf) -> Config {
    let config_file_path = load_config_file(config_dir);
    let config: Config = match fs::read_to_string(&config_file_path) {
        Ok(content) => ron::from_str(content.as_str()).unwrap(),
        Err(_) => Config {
            path_to_config: config_dir.clone(),
            data_source_list: vec![],
            folder_list: vec![],
            ai_integrations: None,
        },
    };
    config
}

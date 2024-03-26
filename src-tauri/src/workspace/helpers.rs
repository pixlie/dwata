use crate::ai::AiIntegration;
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
            path_to_config: config_file_path,
            data_source_list: vec![],
            folder_list: vec![],
            ai_integration_list: vec![],
        },
    };
    config
}

pub fn load_ai_integration(config: &Config, ai_provider_name: &str) -> Option<AiIntegration> {
    match config
        .ai_integration_list
        .iter()
        .find(|x| x.match_by_provider_name(ai_provider_name))
    {
        Some(x) => Some((*x).clone()),
        None => None,
    }
}

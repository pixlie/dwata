use std::path::PathBuf;

use config::Config;
use serde::Deserialize;

pub enum GoogleOAuthAppConfig {
    Configured {
        client_id: String,
        client_secret: String,
    },
    NotConfigured,
}

pub struct DwataConfig {
    pub google_oauth2_app: GoogleOAuthAppConfig,
}

#[derive(Deserialize)]
pub struct RawConfig {
    pub google_oauth2_client_id: Option<String>,
    pub google_oauth2_client_secret: Option<String>,
}

impl DwataConfig {
    pub fn new(root_path: &PathBuf) -> Self {
        let mut config_path = root_path.clone();
        config_path.push("dwata.toml");
        match Config::builder()
            .add_source(config::File::from(config_path))
            .build()
        {
            Ok(settings) => {
                let raw_config: RawConfig = settings.try_deserialize().unwrap();
                DwataConfig {
                    google_oauth2_app: match (
                        raw_config.google_oauth2_client_id,
                        raw_config.google_oauth2_client_secret,
                    ) {
                        (Some(client_id), Some(client_secret)) => {
                            GoogleOAuthAppConfig::Configured {
                                client_id,
                                client_secret,
                            }
                        }
                        _ => GoogleOAuthAppConfig::NotConfigured,
                    },
                }
            }
            Err(_) => DwataConfig {
                google_oauth2_app: GoogleOAuthAppConfig::NotConfigured,
            },
        }
    }
}

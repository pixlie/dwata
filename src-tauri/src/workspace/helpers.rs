use crate::ai::AiIntegration;
use crate::workspace::Config;
use sqlx::migrate::{MigrateDatabase, Migrator};
use sqlx::{Connection, SqliteConnection};
use std::fs;
use std::fs::create_dir_all;
use std::path::{Path, PathBuf};

pub fn load_config(app_config_dir: &PathBuf) -> Config {
    if Path::new(&app_config_dir).try_exists().is_err() {
        fs::create_dir(&app_config_dir).unwrap();
    }

    let mut config_file_path = app_config_dir.clone();
    config_file_path.push("default.ron");
    let config: Config = match fs::read_to_string(&config_file_path) {
        Ok(content) => ron::from_str(content.as_str()).unwrap(),
        Err(_) => Config::new(config_file_path),
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

pub(crate) async fn get_database_connection(app_config_dir: &PathBuf) -> Option<SqliteConnection> {
    let mut path = app_config_dir.clone();
    // We return a temporary in-memory DB in case we cannot create on disk DB
    // let mut db_path = "sqlite::memory:";
    if let Ok(false) = Path::try_exists(path.as_path()) {
        create_dir_all(path.as_path()).unwrap_or_else(|_| {});
    }
    path.push("dwata.sqlite3");
    let mut db_path = path.to_str().unwrap();
    if let Ok(false) = sqlx::Sqlite::database_exists(db_path).await {
        sqlx::Sqlite::create_database(db_path)
            .await
            .unwrap_or_else(|_| {
                db_path = "sqlite::memory:";
            })
    }
    match SqliteConnection::connect(db_path).await {
        Ok(mut connection) => {
            match Migrator::new(Path::new("./migrations")).await {
                Ok(migrator) => migrator.run(&mut connection).await.unwrap(),
                Err(_) => {}
            }
            Some(connection)
        }
        Err(_) => None,
    }
}

use crate::error::DwataError;
use log::{error, info};
use sqlx::migrate::{MigrateDatabase, Migrator};
use sqlx::{Connection, SqliteConnection};
use std::fs::create_dir_all;
use std::path::{Path, PathBuf};

pub(crate) async fn get_database_connection(
    app_config_dir: &PathBuf,
) -> Result<SqliteConnection, DwataError> {
    let mut path = app_config_dir.clone();
    // We return a temporary in-memory DB in case we cannot create on disk DB
    // let mut db_path = "sqlite::memory:";
    if let Ok(false) = Path::try_exists(app_config_dir) {
        create_dir_all(path.as_path()).unwrap_or_else(|_| {});
    }
    path.push("dwata.sqlite3");
    let db_path = path.to_str().unwrap();
    if !sqlx::Sqlite::database_exists(db_path).await? {
        error!("Could not find existing Dwata DB, creating");
        sqlx::Sqlite::create_database(db_path).await?;
    }
    match SqliteConnection::connect(path.to_str().unwrap()).await {
        Ok(mut connection) => match Migrator::new(Path::new("./migrations")).await {
            Ok(migrator) => {
                migrator.run(&mut connection).await?;
                Ok(connection)
            }
            Err(err) => {
                error!("Could not connect to Dwata DB\n Error: {}", err);
                Err(DwataError::CouldNotConnectToDwataDB)
            }
        },
        Err(err) => {
            error!("Could not connect to Dwata DB\n Error: {}", err);
            Err(DwataError::CouldNotConnectToDwataDB)
        }
    }
}

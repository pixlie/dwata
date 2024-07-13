use crate::error::DwataError;
use log::{error, info};
use sqlx::migrate::{MigrateDatabase, Migrator};
use sqlx::{Connection, Sqlite, SqliteConnection};
use std::fs::create_dir_all;
use std::path::{Path, PathBuf};

pub(crate) async fn get_database_connection(
    app_config_dir: &PathBuf,
    migrations_dir: PathBuf,
) -> Result<SqliteConnection, DwataError> {
    let mut path = app_config_dir.clone();
    if let Ok(false) = Path::try_exists(app_config_dir) {
        create_dir_all(path.as_path()).unwrap_or_else(|_| {});
    }
    path.push("dwata.sqlite3");
    let db_path = path.to_str().unwrap();
    info!("Path to Dwata DB: {}", db_path);
    if !Sqlite::database_exists(db_path).await? {
        info!("Could not find existing Dwata DB, creating");
        Sqlite::create_database(db_path).await?;
    }
    match SqliteConnection::connect(db_path).await {
        Ok(mut connection) => match Migrator::new(migrations_dir).await {
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

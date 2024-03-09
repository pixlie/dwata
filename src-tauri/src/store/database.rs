use sqlx::migrate::MigrateDatabase;
use sqlx::migrate::Migrator;
use sqlx::sqlite::SqliteConnection;
use sqlx::Connection;
use std::fs::create_dir_all;
use std::path::{Path, PathBuf};

pub(crate) async fn get_database_connection(app_config_dir: &PathBuf) -> Option<SqliteConnection> {
    let mut path = app_config_dir.clone();
    // We return a temporary in-memory DB in case we cannot create on disk DB
    let mut db_path = "sqlite::memory:";
    if let Ok(false) = Path::try_exists(path.as_path()) {
        create_dir_all(path.as_path()).unwrap_or_else(|_| {});
    }
    path.push("dwata.sqlite3");
    db_path = path.to_str().unwrap();
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

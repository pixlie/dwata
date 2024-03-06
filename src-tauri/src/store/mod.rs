use crate::workspace::Config;
use sqlx::sqlite::SqliteConnection;
use std::sync::Arc;
use tokio::sync::Mutex;

pub mod database;

pub struct Store {
    pub config: Arc<Mutex<Config>>,
    pub connection: Mutex<Option<SqliteConnection>>,
}

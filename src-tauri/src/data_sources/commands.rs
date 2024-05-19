#[tauri::command]
pub async fn create_database_source(
    _database_type: Option<&str>,
    username: &str,
    password: Option<&str>,
    host: &str,
    port: Option<&str>,
    database: &str,
    store: State<'_, Store>,
) -> Result<String, DwataError> {
    match check_database_connection(username, password, host, port, database).await {
        Ok(_) => {
            let source: DatabaseType =
                DatabaseType::PostgreSQL(Database::new(username, password, host, port, database));
            let data_source: DatabaseSource = DatabaseSource::new(source, None);
            let id = data_source.get_id().clone();
            let mut config_guard = store.config.lock().await;
            config_guard.data_source_list.push(data_source);
            match config_guard.sync_to_file() {
                Ok(_) => Ok(id),
                Err(_) => Err(DwataError::CouldNotWriteConfig),
            }
        }
        Err(e) => Err(e),
    }
}

use crate::data_sources::{DataSource, Database};
use crate::error::DwataError;
use crate::sample_data;
use sqlx::postgres::PgPoolOptions;
use url::quirks::password;

#[tauri::command]
pub fn load_data_sources() -> Result<Vec<DataSource>, DwataError> {
    // Read the CSV file with sample data and respond as Vec<DataSource>
    // let dir = app_handle.path().resource_dir().unwrap();
    let mut csv = csv::ReaderBuilder::new().from_reader(sample_data::DATA_SOURCES.as_bytes());
    Ok(csv
        .deserialize()
        .map(|result| result.unwrap())
        .collect::<Vec<DataSource>>())
}

pub fn get_databases() -> Vec<Database> {
    let mut databases: Vec<Database> = vec![];
    let sql = r#"
    SELECT datname FROM pg_database WHERE NOT datistemplate ORDER BY datname ASC
    "#;
    databases
}

#[tauri::command]
pub async fn check_database_connection(
    username: &str,
    password: Option<&str>,
    host: &str,
    port: Option<&str>,
    database: &str,
) -> Result<bool, DwataError> {
    let opt_port = if port.is_some() {
        format!(":{}", port.unwrap())
    } else {
        "".to_string()
    };
    let opt_password = if password.is_some() {
        format!(":{}", password.unwrap())
    } else {
        "".to_string()
    };
    let conn_url = format!("postgres://{username}{opt_password}@{host}{opt_port}/{database}");

    let conn = PgPoolOptions::new()
        .max_connections(5)
        .connect(conn_url.as_str())
        .await;

    match conn {
        Ok(_) => Ok(true),
        Err(err) => {
            println!("{}", err.to_string());
            return Ok(false);
        }
    }
}

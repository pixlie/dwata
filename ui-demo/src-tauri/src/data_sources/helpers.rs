use crate::error::DwataError;
use sqlx::postgres::PgPoolOptions;

pub async fn check_database_connection(
    username: &str,
    password: Option<&str>,
    host: &str,
    port: Option<&str>,
    database: &str,
) -> Result<String, DwataError> {
    let opt_port = match port {
        Some(x) => format!(":{}", x),
        None => "".to_string(),
    };
    let opt_password = match password {
        Some(x) => format!(":{}", x),
        None => "".to_string(),
    };
    let conn_url = format!("postgres://{username}{opt_password}@{host}{opt_port}/{database}");

    let conn = PgPoolOptions::new()
        .max_connections(5)
        .connect(conn_url.as_str())
        .await;

    match conn {
        Ok(_) => Ok(conn_url),
        Err(err) => {
            println!("{}", err.to_string());
            Err(DwataError::CouldNotConnectToDatabase)
        }
    }
}

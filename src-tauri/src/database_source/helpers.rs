use crate::database_source::DatabaseType;
use crate::error::DwataError;
use log::error;
use sqlx::postgres::PgPoolOptions;

pub async fn check_database_connection(
    database_type: &DatabaseType,
    host: &str,
    port: Option<&u16>,
    username: &str,
    password: Option<&str>,
    name: &str,
) -> Result<(), DwataError> {
    let opt_port = match port {
        Some(x) => format!(":{}", x),
        None => "".to_string(),
    };
    let opt_password = match password {
        Some(x) => format!(":{}", x),
        None => "".to_string(),
    };
    let conn_url = match database_type {
        DatabaseType::PostgreSQL => {
            format!("postgresql://{username}{opt_password}@{host}{opt_port}/{name}")
        }
        DatabaseType::MySQL => format!("mysql://{username}{opt_password}@{host}{opt_port}/{name}"),
        DatabaseType::SQLite => {
            format!("sqlite3://{username}{opt_password}@{host}{opt_port}/{name}")
        }
        _ => {
            return Err(DwataError::InvalidDatabaseType);
        }
    };

    let conn = PgPoolOptions::new()
        .max_connections(5)
        .connect(conn_url.as_str())
        .await;

    match conn {
        Ok(_) => Ok(()),
        Err(err) => {
            error!(
                "Could not connect to requested DB\n Error: {}",
                err.to_string()
            );
            Err(DwataError::CouldNotConnectToDatabase)
        }
    }
}

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha512};
use sqlx::postgres::PgPoolOptions;
use std::path::PathBuf;
use ts_rs::TS;

pub mod helpers;

// #[derive(Debug, Deserialize, Serialize)]
// pub enum NeedsSSH {
//     No,
//     Yes(SSHConnection),
// }

// pub struct SSHPrivateKey {
//     private_key: Option<PathBuf>,
//     ssh_key_password: Option<String>,
// }

// pub enum  SSHSecret {
//     Password(String),
//     PrivateKey(SSHPrivateKey)
// }

// #[derive(Debug, Deserialize, Serialize)]
// pub struct SSHConnection {
//     username: String,
//     secret: SSHSecret,
//     port: u8,
// }

#[derive(Debug, Deserialize, Serialize)]
pub struct DatabaseTCPSocket {
    host: String,
    port: Option<u32>,
}

impl DatabaseTCPSocket {
    pub fn get_host_port(&self) -> (String, Option<u32>) {
        (self.host.clone(), self.port.clone())
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub enum DatabaseConnection {
    File(PathBuf), // For embedded database
    UnixSocket(PathBuf),
    TCPSocket(DatabaseTCPSocket),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DatabaseAuthentication {
    username: String,
    password: Option<String>,
}

impl DatabaseAuthentication {
    pub fn get_username_password(&self) -> (String, Option<String>) {
        (self.username.clone(), self.password.clone())
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct Database {
    name: String,
    #[serde(skip_serializing)]
    #[ts(skip)]
    connection: DatabaseConnection,
    #[serde(skip_serializing)]
    #[ts(skip)]
    authentication: DatabaseAuthentication, // needs_ssh: NeedsSSH,
}

impl Database {
    pub fn get_connection_url(&self) -> Option<String> {
        let (host, port) = match &self.connection {
            DatabaseConnection::TCPSocket(socket) => socket.get_host_port(),
            _ => return None,
        };
        let (username, password) = &self.authentication.get_username_password();
        let opt_port = match port {
            Some(x) => format!(":{}", x),
            None => "".to_string(),
        };
        let opt_password = match password {
            Some(x) => format!(":{}", x),
            None => "".to_string(),
        };
        let database = &self.name;
        Some(format!(
            "postgresql://{username}{opt_password}@{host}{opt_port}/{database}"
        ))
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum DataSourceType {
    PostgreSQL(Database),
    MySQL(Database),
    SQLite(Database),
    MSSQL(Database),
    MongoDB(Database),
}

impl DataSourceType {
    pub fn get_database(&self) -> Option<&Database> {
        match self {
            DataSourceType::PostgreSQL(db) => Some(db),
            _ => None,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DataSource {
    id: String,
    label: Option<String>,
    source: DataSourceType,
}

pub enum DataSourceConnection {
    PostgreSQL(sqlx::PgPool),
}

impl DataSource {
    pub fn new_database(database: Database, label: Option<String>) -> Self {
        // Assume only PostgreSQL
        DataSource {
            id: Self::hash("PostgreSQL", &database),
            label,
            source: DataSourceType::PostgreSQL(database),
        }
    }

    fn hash(data_source_type: &str, database: &Database) -> String {
        let mut hasher = Sha512::new();
        hasher.update(data_source_type);
        hasher.update(&database.name);
        // hasher.update()
        format!("{:x}", hasher.finalize())
    }

    pub fn get_id(&self) -> String {
        self.id.clone()
    }

    pub fn get_database(&self) -> Option<&Database> {
        match &self.source {
            DataSourceType::PostgreSQL(db) => Some(&db),
            _ => None,
        }
    }

    pub async fn get_connection(&self) -> Option<DataSourceConnection> {
        match self.get_database().unwrap().get_connection_url() {
            Some(conn_url) => {
                match PgPoolOptions::new()
                    .max_connections(5)
                    .connect(conn_url.as_str())
                    .await
                {
                    Ok(pool) => Some(DataSourceConnection::PostgreSQL(pool)),
                    Err(_) => None,
                }
            }
            None => None,
        }
    }
}

impl Database {
    pub fn new(
        username: &str,
        password: Option<&str>,
        host: &str,
        port: Option<&str>,
        database: &str,
    ) -> Database {
        Database {
            name: database.to_string(),
            connection: DatabaseConnection::TCPSocket(DatabaseTCPSocket {
                host: host.to_string(),
                port: match port {
                    Some(x) => Some(x.parse::<u32>().unwrap()),
                    None => None,
                },
            }),
            authentication: DatabaseAuthentication {
                username: username.to_string(),
                password: match password {
                    Some(x) => Some(x.to_string()),
                    None => None,
                },
            },
        }
    }
}

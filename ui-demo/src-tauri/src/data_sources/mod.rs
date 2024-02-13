use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha512};
use std::path::PathBuf;

pub mod commands;
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

#[derive(Debug, Deserialize, Serialize)]
pub struct Database {
    name: String,
    connection: DatabaseConnection,
    authentication: DatabaseAuthentication, // needs_ssh: NeedsSSH,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum DataSourceType {
    PostgreSQL(Database),
    MySQL(Database),
    SQLite(Database),
    MSSQL(Database),
    MongoDB(Database),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DataSource {
    id: String,
    label: Option<String>,
    source: DataSourceType,
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

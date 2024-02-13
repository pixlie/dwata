use serde::{Deserialize, Serialize};

pub mod commands;

// #[derive(Debug, Deserialize, Serialize)]
// pub enum NeedsSSH {
//     No,
//     Yes(SSHConnection),
// }

// #[derive(Debug, Deserialize, Serialize)]
// pub struct SSHConnection {
//     username: String,
//     password: Option<String>,
//     private_key: Option<PathBuf>,
//     ssh_key_password: Option<String>,
//     port: u8,
// }

#[derive(Debug, Deserialize, Serialize)]
pub struct DatabaseConnection {
    // needs_ssh: NeedsSSH,
    host: String,
    username: String,
    password: String,
    port: u8,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Database {
    name: String,
    label: Option<String>,
    connection: DatabaseConnection,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum DataSourceType {
    PostgreSQL(Database),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DataSource {
    id: i64,
    label: String,
    path: String,
    source_type: DataSourceType,
}

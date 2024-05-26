use crate::chat::api_types::{APIChatContextNode, APIChatContextType};
use crate::chat::ChatContextNode;
use crate::data_sources::api_types::APIDataSource;
use crate::error::DwataError;
use crate::relational_database::api_types::APIGridQuery;
use crate::relational_database::postgresql::PostgreSQLQueryBuilder;
use crate::relational_database::QueryBuilder;
use crate::schema::api_types::APIGridSchema;
use crate::schema::helpers::get_schema_summary;
use crate::schema::postgresql;
use crate::schema::postgresql::PostgreSQLObject;
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgPoolOptions;
use std::path::PathBuf;
use ts_rs::TS;
use ulid::Ulid;

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
    // TODO: Add API_KEY support
    // https://github.com/brainless/dwata/issues/118
    username: String,
    password: Option<String>,
}

impl DatabaseAuthentication {
    pub fn get_username_password(&self) -> (String, Option<String>) {
        (self.username.clone(), self.password.clone())
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Database {
    pub name: String,
    connection: DatabaseConnection,
    // TODO: Make authentication optional to allow for no authentication (locally hosted databases)
    // https://github.com/brainless/dwata/issues/118
    authentication: DatabaseAuthentication,
    // needs_ssh: NeedsSSH,
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

#[derive(Debug, Deserialize, Serialize)]
pub enum DatabaseType {
    PostgreSQL(Database),
    MySQL(Database),
    SQLite(Database),
    MSSQL(Database),
    MongoDB(Database),
    Qdrant(Database),
}

impl DatabaseType {
    pub fn get_query_builder(&self, grid: &APIGridQuery) -> Option<QueryBuilder> {
        match self {
            DatabaseType::PostgreSQL(_) => {
                Some(QueryBuilder::PostgreSQL(PostgreSQLQueryBuilder::new(grid)))
            }
            _ => None,
        }
    }

    pub fn get_api_type(&self) -> &str {
        match self {
            DatabaseType::PostgreSQL(_) => "PostgreSQL",
            DatabaseType::MySQL(_) => "MySQL",
            DatabaseType::SQLite(_) => "SQLite",
            DatabaseType::Qdrant(_) => "Qdrant",
            _ => "",
        }
    }

    pub fn get_api_name(&self) -> String {
        match self {
            DatabaseType::PostgreSQL(x) => x.name.clone(),
            DatabaseType::MySQL(x) => x.name.clone(),
            DatabaseType::SQLite(x) => x.name.clone(),
            DatabaseType::Qdrant(x) => x.name.clone(),
            _ => "".to_string(),
        }
    }
}

pub enum DatabasePool {
    PostgreSQL(sqlx::PgPool),
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename = "DatabaseSource", export_to = "../src/api_types/")]
pub struct DatabaseSource {
    id: String,
    pub label: Option<String>,
    pub source: DatabaseType,
}

impl DatabaseSource {
    pub fn new(source: DatabaseType, label: Option<String>) -> Self {
        DatabaseSource {
            id: Ulid::new().to_string(),
            label,
            source,
        }
    }

    pub fn get_id(&self) -> String {
        self.id.clone()
    }

    pub fn get_name(&self) -> String {
        self.source.get_api_name()
    }

    pub fn get_tool_name(&self) -> String {
        format!(
            "{}-{}-{}",
            self.source.get_api_type(),
            self.source.get_api_name(),
            self.id
        )
    }

    pub fn get_database(&self) -> Option<&Database> {
        match &self.source {
            DatabaseType::PostgreSQL(db) => Some(&db),
            DatabaseType::Qdrant(db) => Some(&db),
            _ => None,
        }
    }

    pub async fn get_connection(&self) -> Option<DatabasePool> {
        match self.get_database().unwrap().get_connection_url() {
            Some(conn_url) => {
                match PgPoolOptions::new()
                    .max_connections(5)
                    .connect(conn_url.as_str())
                    .await
                {
                    Ok(pool) => Some(DatabasePool::PostgreSQL(pool)),
                    Err(_) => None,
                }
            }
            None => None,
        }
    }

    pub fn get_query_builder(&self, grid: &APIGridQuery) -> Option<QueryBuilder> {
        self.source.get_query_builder(grid)
    }

    pub fn get_api_data_source(&self) -> APIDataSource {
        APIDataSource::new(
            self.id.clone(),
            self.label.clone(),
            self.source.get_api_type().to_string(),
            self.source.get_api_name(),
        )
    }

    pub async fn get_tables(&self, with_columns: Option<bool>) -> Vec<APIGridSchema> {
        match self.get_connection().await {
            Some(DatabasePool::PostgreSQL(pg_pool)) => {
                let db_objects = postgresql::metadata::get_postgres_objects(&pg_pool).await;
                let tables = db_objects
                    .iter()
                    .filter(|item| item.filter_is_table())
                    .collect::<Vec<&PostgreSQLObject>>();
                let mut dwata_tables: Vec<APIGridSchema> = vec![];
                for table in tables {
                    dwata_tables.push(table.get_table(self, with_columns).await);
                }
                dwata_tables
            }
            _ => {
                vec![]
            }
        }
    }
}

impl ChatContextNode for DatabaseSource {
    fn get_self_chat_context_node(&self) -> APIChatContextNode {
        APIChatContextNode::new(
            self.get_id(),
            APIChatContextType::DataSource,
            self.get_name(),
            false,
        )
    }

    fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode> {
        if node_path.is_empty() {
            vec![APIChatContextNode::new(
                "__schema__".to_string(),
                APIChatContextType::StructureOfDataSource,
                format!("Structure of tables in {}", self.get_name()),
                true,
            )]
        } else {
            vec![]
        }
    }

    async fn get_chat_context(&self, node_path: &[String]) -> Result<String, DwataError> {
        if node_path.first() == Some(&"__schema__".to_string()) {
            Ok(get_schema_summary(self).await)
        } else {
            Err(DwataError::CouldNotFindNode)
        }
    }
}

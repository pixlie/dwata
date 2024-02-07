use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::PathBuf;

pub mod commands;
mod postgresql_metadata;

#[derive(Debug, Deserialize, Serialize)]
pub struct TypeInteger {
    byte_size: Option<u8>, // Can represent SMALLINT, INT, BIGINT, etc.
    auto_increment: bool,  // Can represent SMALLSERIAL, SERIAL, BIGSERIAL, etc.
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TypeFloat {
    byte_size: Option<u8>,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum TypeINet {
    V4,
    V6,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TypeArray {
    length: usize,
    variable_length: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum ColumnDataType {
    SignedInteger(TypeInteger),
    // UnsignedInteger(TypeInteger),
    Float(TypeFloat),
    CharArray(TypeArray),
    Boolean,
    BitArray(TypeArray),
    ByteArray(TypeArray),
    JSON,
    JSONB,
    INet(TypeINet),
    UUID,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum Protocol {
    Http,
    Https,
    Ssh(SSHConnection),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Database {
    name: String,
    label: Option<String>,
    connection: DatabaseConnection,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct SSHConnection {
    username: String,
    password: Option<String>,
    private_key: Option<PathBuf>,
    ssh_key_password: Option<String>,
    port: u8,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DatabaseConnection {
    protocol: Protocol,
    host: String,
    username: String,
    password: String,
    port: u8,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ForeignKey {
    foreign_table: String,
    foreign_column: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum IsForeignKey {
    No,
    Yes(ForeignKey),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Column {
    name: String,
    label: Option<String>,
    data_type: ColumnDataType,
    is_auto_increment: bool,
    is_primary_key: bool,
    is_index: bool,
    is_foreign_key: IsForeignKey,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TableSchema {
    name: String,
    columns: Vec<Column>,
    primary_key: Option<String>,
    foreign_keys: Vec<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Schema {
    sources: Vec<String>,
    tables: Vec<TableSchema>,
}

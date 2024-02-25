use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub mod commands;
pub mod helpers;
pub mod metadata;
pub mod postgresql;

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct TypeInteger {
    byte_size: Option<u8>, // Can represent SMALLINT, INT, BIGINT, etc.
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct TypeFloat {
    byte_size: Option<u8>,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum TypeINet {
    V4,
    V6,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct TypeArray {
    length: Option<i32>,
    // variable_length: bool,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum ColumnDataType {
    SignedInteger(TypeInteger),
    // UnsignedInteger(TypeInteger),
    Float(TypeFloat),
    CharArray(TypeArray),
    Boolean,
    // BitArray(TypeArray),
    // ByteArray(TypeArray),
    JSON,
    JSONB,
    // INet(TypeINet),
    UUID,
    Text,
    Unknown,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ForeignKey {
    foreign_table: String,
    foreign_column: String,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum IsForeignKey {
    No,
    Yes(ForeignKey),
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DwataColumn {
    name: String,
    label: Option<String>,
    data_type: ColumnDataType,
    is_nullable: bool,
    is_auto_increment: bool,
    is_primary_key: bool,
    is_indexed: bool,
    is_foreign_key: IsForeignKey,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DwataTable {
    name: String,
    schema_name: String,
    columns: Vec<DwataColumn>,
    primary_key: Option<String>,
    foreign_keys: Vec<String>,
}

impl DwataTable {
    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn get_schema_name(&self) -> String {
        self.schema_name.clone()
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DwataSchema {
    tables: Vec<DwataTable>,
}

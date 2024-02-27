use crate::data_sources::{DataSource, DataSourceConnection};
use crate::schema::postgresql;
use derive_builder::Builder;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Default, Clone, Deserialize, Serialize, TS, Builder)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
#[builder(default)]
pub struct TypeInteger {
    byte_size: Option<u8>, // Can represent SMALLINT, INT, BIGINT, etc.
}

#[derive(Debug, Default, Clone, Deserialize, Serialize, TS, Builder)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
#[builder(default)]
pub struct TypeFloat {
    byte_size: Option<u8>,
}

#[derive(Debug, Deserialize, Serialize)]
pub enum TypeINet {
    V4,
    V6,
}

#[derive(Debug, Clone, Deserialize, Serialize, TS, Builder)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct TypeArray {
    length: Option<i32>,
    // variable_length: bool,
}

#[derive(Debug, Clone, Deserialize, Serialize, TS)]
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

#[derive(Debug, Clone, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ForeignKey {
    foreign_table: String,
    foreign_column: String,
}

#[derive(Debug, Clone, Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum IsForeignKey {
    No,
    Yes(ForeignKey),
}

#[derive(Debug, Clone, Deserialize, Serialize, TS, Builder)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct APIGridColumn {
    name: String,
    label: Option<String>,
    data_type: ColumnDataType,
    is_nullable: bool,
    is_auto_increment: bool,
    is_primary_key: bool,
    is_indexed: bool,
    is_foreign_key: IsForeignKey,
}

impl APIGridColumn {
    pub fn get_name(&self) -> String {
        self.name.clone()
    }
}

#[derive(Debug, Default, Deserialize, Serialize, TS, Builder)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
#[builder(pattern = "owned")]
#[builder(default)]
pub struct APIGridSchema {
    source: String,
    name: Option<String>,
    schema: Option<String>,
    columns: Vec<APIGridColumn>,
    primary_key: Option<String>,
    foreign_keys: Vec<String>,
    comment: Option<String>,

    #[builder(setter(skip))]
    #[builder(default = "false")]
    has_fetched_columns: bool,
}

impl APIGridSchema {
    pub fn get_name(&self) -> String {
        self.name.clone().unwrap().clone()
    }

    pub async fn get_columns(&mut self, data_source: &DataSource) -> Vec<APIGridColumn> {
        if self.has_fetched_columns {
            self.columns.to_vec()
        } else {
            match data_source.get_connection().await {
                Some(DataSourceConnection::PostgreSQL(pg_pool)) => {
                    let mut columns = postgresql::metadata::get_postgres_columns(
                        &pg_pool,
                        self.schema.clone().unwrap(),
                        self.name.clone().unwrap(),
                    )
                    .await;
                    self.columns = columns
                        .iter()
                        .map(|column| column.get_generic_column())
                        .collect::<Vec<APIGridColumn>>();
                }
                _ => {}
            }
            self.has_fetched_columns = true;
            self.columns.to_vec()
        }
    }
}

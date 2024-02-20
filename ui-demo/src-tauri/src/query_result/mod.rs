use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub mod commands;
pub mod postgresql;

use crate::data_sources::DataSourceConnection;
use crate::query_result::postgresql::PostgreSQLQueryBuilder;
use crate::workspace::Config;
use std::collections::HashMap;

#[derive(Debug, Clone, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ColumnPath {
    cn: String,
    tn: String,
    dsi: String,
}

impl PartialEq for ColumnPath {
    fn eq(&self, other: &Self) -> bool {
        self.tn == other.tn && self.cn == other.cn
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub enum QueryOrder {
    Asc,
    Desc,
}

#[derive(Debug, Default, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DwataQuery {
    select: Vec<ColumnPath>,
    ordering: Option<HashMap<u8, QueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

impl DwataQuery {
    pub async fn get_data(&self, config: Config) -> DwataData {
        // let mut data_by_sources: Vec<DataBySource> = vec![];
        let mut data_by_row: Vec<Vec<String>> = vec![];
        for column_path in &self.select {
            let data_source = config.get_data_source(column_path.dsi.as_str());
            match data_source {
                Some(ds) => match ds.get_query_builder(self).unwrap() {
                    QueryBuilder::PostgreSQL(builder) => match ds.get_connection().await {
                        Some(conn_type) => match conn_type {
                            DataSourceConnection::PostgreSQL(conn) => {
                                builder
                                    .get_data(&conn, &mut data_by_row, &self.select)
                                    .await;
                            }
                        },
                        None => {}
                    },
                },
                _ => {}
            }
        }
        DwataData {
            columns: self.select.clone(),
            rows_of_columns: data_by_row,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DwataData {
    columns: Vec<ColumnPath>,
    rows_of_columns: Vec<Vec<String>>,
}

pub struct DataBySource {
    data_source_id: String,
    columns: Vec<ColumnPath>,
    data: Vec<Vec<String>>,
}

pub enum QueryBuilder {
    PostgreSQL(PostgreSQLQueryBuilder),
}

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
        let data: DwataData = DwataData {
            columns: self.select.clone(),
            column_wise_data: vec![],
        };
        for column_path in &self.select {
            let data_source = config.get_data_source(column_path.dsi.as_str());
            match data_source {
                Some(ds) => match ds.get_query_builder(self).unwrap() {
                    QueryBuilder::PostgreSQL(builder) => match ds.get_connection().await {
                        Some(conn_type) => match conn_type {
                            DataSourceConnection::PostgreSQL(conn) => {
                                let _column_wise_data = builder.get_data(&conn).await;
                            }
                        },
                        None => {}
                    },
                },
                _ => {}
            }
        }
        data
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct DwataData {
    columns: Vec<ColumnPath>,
    column_wise_data: Vec<Vec<String>>,
}

pub struct ColumnWiseData {
    data_source_id: String,
    columns: Vec<ColumnPath>,
    data: HashMap<String, Vec<String>>,
}

pub enum QueryBuilder {
    PostgreSQL(PostgreSQLQueryBuilder),
}

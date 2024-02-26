use crate::data_sources::DataSourceConnection;
use crate::query_result::api_types::APIGridData;
use crate::query_result::postgresql::PostgreSQLQueryBuilder;
use crate::workspace::Config;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

mod api_types;
pub mod commands;
pub mod postgresql;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct SelectColumnsPath {
    source: String,
    schema: Option<String>,
    table: Option<String>,
    // Columns only from one logical table, not merging should be needed
    columns: Vec<String>,
    ordering: Option<HashMap<u8, QueryOrder>>,
    filtering: Option<HashMap<u8, String>>,
}

impl SelectColumnsPath {
    pub fn get_schema_and_table_names(
        &self,
        default_schema_name: Option<String>,
    ) -> (String, String) {
        (
            self.schema
                .clone()
                .unwrap_or_else(|| default_schema_name.unwrap_or_else(|| "public".to_string())),
            self.table.clone().unwrap(),
        )
    }

    pub fn get_columns(&self) -> Vec<String> {
        self.columns.clone()
    }
}

impl PartialEq for SelectColumnsPath {
    fn eq(&self, other: &Self) -> bool {
        self.table == other.table && self.columns == other.columns
    }
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum QueryOrder {
    Asc,
    Desc,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DwataQuery {
    // Each SelectColumnsPath represents the columns that are fetched within any tabular source
    // without needing any merging
    select: Vec<SelectColumnsPath>,
}

impl DwataQuery {
    pub async fn get_data(&self, config: &Config) -> Vec<APIGridData> {
        let data: Vec<APIGridData> = vec![];
        for column_path in &self.select {
            let data_source = config.get_data_source(column_path.source.as_str());
            match data_source {
                Some(ds) => match ds.get_query_builder(self).unwrap() {
                    QueryBuilder::PostgreSQL(builder) => match ds.get_connection().await {
                        Some(conn_type) => match conn_type {
                            DataSourceConnection::PostgreSQL(conn) => {
                                builder.get_data(&conn).await;
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

pub struct DataBySource {
    data_source_id: String,
    columns: Vec<SelectColumnsPath>,
    data: Vec<Vec<String>>,
}

pub enum QueryBuilder {
    PostgreSQL(PostgreSQLQueryBuilder),
}

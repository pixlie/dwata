// use crate::data_sources::DataSourceConnection;
use crate::query_result::postgresql::PostgreSQLQueryBuilder;
// use crate::workspace::Config;
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
    // pub async fn get_data(&self, config: &Config) -> DwataData {
    //     // let mut data_by_sources: Vec<DataBySource> = vec![];
    //     let mut data_by_row: Vec<Vec<String>> = vec![];
    //     for column_path in &self.select {
    //         let data_source = config.get_data_source(column_path.source.as_str());
    //         match data_source {
    //             Some(ds) => match ds.get_query_builder(self).unwrap() {
    //                 QueryBuilder::PostgreSQL(builder) => match ds.get_connection().await {
    //                     Some(conn_type) => match conn_type {
    //                         DataSourceConnection::PostgreSQL(conn) => {
    //                             builder
    //                                 .get_data(&conn, &mut data_by_row, &self.select)
    //                                 .await;
    //                         }
    //                     },
    //                     None => {}
    //                 },
    //             },
    //             _ => {}
    //         }
    //     }
    //     DwataData {
    //         columns: self.select.clone(),
    //         rows_of_columns: data_by_row,
    //     }
    // }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct DwataData {
    columns: Vec<SelectColumnsPath>,
    rows_of_columns: Vec<Vec<String>>,
}

pub struct DataBySource {
    data_source_id: String,
    columns: Vec<SelectColumnsPath>,
    data: Vec<Vec<String>>,
}

pub enum QueryBuilder {
    PostgreSQL(PostgreSQLQueryBuilder),
}

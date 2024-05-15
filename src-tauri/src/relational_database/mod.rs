// use crate::data_sources::DatabasePool;
// use crate::relational_database::api_types::{APIGridData, APIGridDataBuilder, APIGridQuery};
// use crate::relational_database::postgresql::PostgreSQLQueryBuilder;
// use crate::workspace::Config;
// use serde::{Deserialize, Serialize};

// pub mod api_types;
// pub mod commands;
pub mod crud;
// pub mod postgresql;

// #[derive(Debug, Clone, Deserialize, Serialize)]
// pub struct SelectColumnsPath {
//     source: String,
//     schema: Option<String>,
//     table: Option<String>,
//     // Columns only from one logical table, not merging should be needed
//     columns: Vec<String>,
//     ordering: Option<HashMap<u8, QueryOrder>>,
//     filtering: Option<HashMap<u8, String>>,
// }
//
// impl SelectColumnsPath {
//     pub fn get_schema_and_table_names(
//         &self,
//         default_schema_name: Option<String>,
//     ) -> (String, String) {
//         (
//             self.schema
//                 .clone()
//                 .unwrap_or_else(|| default_schema_name.unwrap_or_else(|| "public".to_string())),
//             self.table.clone().unwrap(),
//         )
//     }
//
//     pub fn get_columns(&self) -> Vec<String> {
//         self.columns.clone()
//     }
// }
//
// impl PartialEq for SelectColumnsPath {
//     fn eq(&self, other: &Self) -> bool {
//         self.table == other.table && self.columns == other.columns
//     }
// }

// #[derive(Debug, Clone, Deserialize, Serialize)]
// pub enum QueryOrder {
//     Asc,
//     Desc,
// }

// pub enum QueryBuilder {
//     PostgreSQL(PostgreSQLQueryBuilder),
// }

// #[derive(Debug, Deserialize)]
// pub struct DwataQuery {
//     // Each SelectColumnsPath represents the columns that are fetched within any tabular source
//     // without needing any merging
//     select: Vec<APIGridQuery>,
// }

// impl DwataQuery {
//     pub async fn get_data(&self, config: &Config) -> Vec<APIGridData> {
//         let mut data: Vec<APIGridData> = vec![];
//         for grid in &self.select {
//             let data_source = config.get_database_by_id(grid.get_source_name().as_str());
//             let (schema_name, table_name) = grid.get_schema_and_table_names(None);
//             let grid_data = APIGridDataBuilder::default()
//                 .source(grid.get_source_name())
//                 .schema(Some(schema_name))
//                 .table(Some(table_name))
//                 .rows(match data_source {
//                     Some(ds) => match ds.get_query_builder(grid).unwrap() {
//                         QueryBuilder::PostgreSQL(builder) => match ds.get_connection().await {
//                             Some(conn_type) => match conn_type {
//                                 DatabasePool::PostgreSQL(conn) => builder.get_data(&conn).await,
//                             },
//                             None => vec![],
//                         },
//                     },
//                     _ => vec![],
//                 })
//                 .build()
//                 .unwrap();
//             data.push(grid_data);
//         }
//         data
//     }
// }

// use crate::ai::{AIIntegration, AITools, Tool, ToolParameter, ToolParameterType};
// use crate::chat::api_types::APIChatContextNode;
// use crate::chat::ChatContextNode;
// use crate::data_sources::DatabaseSource;
// use crate::error::DwataError;
// use serde::{Deserialize, Serialize};
use sqlx::SqliteConnection;
// use std::fs;
// use std::path::PathBuf;
// use std::sync::Arc;
use tokio::sync::Mutex;
// use ts_rs::TS;

// pub mod api_types;
pub mod commands;
pub mod configuration;
pub mod helpers;

pub type DwataDb = Mutex<Option<SqliteConnection>>;

// impl ChatContextNode for Config {
//     fn get_self_chat_context_node(&self) -> APIChatContextNode {
//         todo!()
//     }

//     fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode> {
//         if node_path.is_empty() {
//             let list: Vec<APIChatContextNode> = self
//                 .data_source_list
//                 .iter()
//                 .map(|x| x.get_self_chat_context_node())
//                 .collect();
//             // list.push(APIChatContextNode::new(
//             //     "__upload_file__".to_string(),
//             //     APIChatContextType::ContentsFromFile,
//             //     "Contents of a file".to_string(),
//             //     false,
//             // ));
//             list
//         } else {
//             let data_source = self
//                 .data_source_list
//                 .iter()
//                 .find(|x| x.get_id() == node_path[0]);
//             data_source
//                 .unwrap()
//                 .get_next_chat_context_node_list(&node_path[1..])
//         }
//     }

//     async fn get_chat_context(&self, node_path: &[String]) -> Result<String, DwataError> {
//         let data_source = self
//             .data_source_list
//             .iter()
//             .find(|x| x.get_id() == node_path[0]);
//         data_source.unwrap().get_chat_context(&node_path[1..]).await
//     }
// }

// impl AITools for Config {
//     fn get_self_tool_list(&self) -> Vec<Tool> {
//         let data_source_list: Vec<String> = self
//             .data_source_list
//             .iter()
//             .map(|x| x.get_tool_name().clone())
//             .collect();
//         let first_source = data_source_list.clone().first().unwrap().clone();
//         vec![Tool::new(
//             "get_schema_of_selected_data_source".to_string(),
//             "I have multiple business databases.\
//              This function retrieves the schema of all tables of the selected data source.\
//               You can use the schema to generate SQL."
//                 .to_string(),
//             vec![ToolParameter::new(
//                 "data_source_id".to_string(),
//                 ToolParameterType::Enum(data_source_list),
//                 format!(
//                     "Select a data source from these options, example {}",
//                     first_source
//                 ),
//             )],
//             vec!["data_source_id".to_string()],
//         )]
//     }
// }

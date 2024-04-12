use crate::ai::AiIntegration;
use crate::chat::api_types::{APIChatContextNode, APIChatContextType};
use crate::chat::ChatContextNode;
use crate::data_sources::DataSource;
use crate::error::DwataError;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

pub mod api_types;
pub mod commands;
pub mod helpers;

#[derive(Debug, Deserialize, Serialize)]
pub struct Config {
    path_to_config: PathBuf,
    // organisations: Vec<Organisation>,
    pub(crate) data_source_list: Vec<DataSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    folder_list: Vec<PathBuf>, // CSV or Markdown files
    ai_integration_list: Vec<AiIntegration>,
}

impl Config {
    pub fn get_data_source(&self, data_source_id: &str) -> Option<&DataSource> {
        self.data_source_list
            .iter()
            .find(|x| x.get_id() == data_source_id)
    }

    pub fn get_pretty_string(&self) -> String {
        ron::ser::to_string_pretty(&self, ron::ser::PrettyConfig::default()).unwrap()
    }
}

impl ChatContextNode for Config {
    fn get_self_chat_context_node(&self) -> APIChatContextNode {
        todo!()
    }

    fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode> {
        if node_path.is_empty() {
            let mut list: Vec<APIChatContextNode> = self
                .data_source_list
                .iter()
                .map(|x| x.get_self_chat_context_node())
                .collect();
            // list.push(APIChatContextNode::new(
            //     "__upload_file__".to_string(),
            //     APIChatContextType::ContentsFromFile,
            //     "Contents of a file".to_string(),
            //     false,
            // ));
            list
        } else {
            let data_source = self
                .data_source_list
                .iter()
                .find(|x| x.get_id() == node_path[0]);
            data_source
                .unwrap()
                .get_next_chat_context_node_list(&node_path[1..])
        }
    }

    async fn get_chat_context(&self, node_path: &[String]) -> Result<String, DwataError> {
        let data_source = self
            .data_source_list
            .iter()
            .find(|x| x.get_id() == node_path[0]);
        data_source.unwrap().get_chat_context(&node_path[1..]).await
    }
}

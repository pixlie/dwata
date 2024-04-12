use crate::ai::AiIntegration;
use crate::chat::api_types::APIChatContextNode;
use crate::chat::ChatContextNode;
use crate::data_sources::DataSource;
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

    fn get_next_chat_context_node_list(
        &self,
        current_context: &[String],
    ) -> Vec<APIChatContextNode> {
        if current_context.is_empty() {
            self.data_source_list
                .iter()
                .map(|x| x.get_self_chat_context_node())
                .collect()
        } else {
            let data_source = self
                .data_source_list
                .iter()
                .find(|x| x.get_id() == current_context[0]);
            data_source.unwrap().get_next_chat_context_node_list(&current_context[1..])
        }
    }
}

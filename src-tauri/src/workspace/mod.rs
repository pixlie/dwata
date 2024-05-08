use crate::ai::{AITools, AiIntegration, Tool, ToolParameter, ToolParameterType};
use crate::chat::api_types::APIChatContextNode;
use crate::chat::ChatContextNode;
use crate::data_sources::directory::FolderSource;
use crate::data_sources::DatabaseSource;
use crate::error::DwataError;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

pub mod api_types;
pub mod commands;
pub mod helpers;

#[derive(Debug, Deserialize, Serialize)]
pub struct Config {
    path_to_config: PathBuf,
    // organisations: Vec<Organisation>,
    data_source_list: Vec<DatabaseSource>,
    // api_list: Vec<>, // Stripe, Shopify, etc.
    folder_list: Vec<FolderSource>, // CSV or Markdown files
    ai_integration_list: Vec<AiIntegration>,
}

impl Config {
    pub fn new(path_to_config: PathBuf) -> Self {
        Config {
            path_to_config,
            data_source_list: vec![],
            folder_list: vec![],
            ai_integration_list: vec![],
        }
    }

    pub fn add_database_source(&mut self, database_source: DatabaseSource) {
        self.data_source_list.push(database_source);
    }

    pub fn add_folder_source(&mut self, folder_source: FolderSource) {
        self.folder_list.push(folder_source);
    }

    pub fn sync_to_file(&self) -> Result<(), DwataError> {
        match fs::write(self.path_to_config.clone(), self.get_pretty_string()) {
            Ok(_) => Ok(()),
            Err(_) => Err(DwataError::CouldNotWriteConfig),
        }
    }
}

impl Config {
    pub fn get_data_source(&self, data_source_id: &str) -> Option<&DatabaseSource> {
        self.data_source_list
            .iter()
            .find(|x| x.get_id() == data_source_id)
    }

    pub fn get_pretty_string(&self) -> String {
        ron::ser::to_string_pretty(&self, ron::ser::PrettyConfig::default()).unwrap()
    }

    pub fn find_directory(&self, folder_id: String) -> Option<&FolderSource> {
        self.folder_list.iter().find(|x| x.match_id(&folder_id))
    }
}

impl ChatContextNode for Config {
    fn get_self_chat_context_node(&self) -> APIChatContextNode {
        todo!()
    }

    fn get_next_chat_context_node_list(&self, node_path: &[String]) -> Vec<APIChatContextNode> {
        if node_path.is_empty() {
            let list: Vec<APIChatContextNode> = self
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

impl AITools for Config {
    fn get_self_tool_list(&self) -> Vec<Tool> {
        let data_source_list: Vec<String> = self
            .data_source_list
            .iter()
            .map(|x| x.get_tool_name().clone())
            .collect();
        let first_source = data_source_list.clone().first().unwrap().clone();
        vec![Tool::new(
            "get_schema_of_selected_data_source".to_string(),
            "I have multiple business databases.\
             This function retrieves the schema of all tables of the selected data source.\
              You can use the schema to generate SQL."
                .to_string(),
            vec![ToolParameter::new(
                "data_source_id".to_string(),
                ToolParameterType::Enum(data_source_list),
                format!(
                    "Select a data source from these options, example {}",
                    first_source
                ),
            )],
            vec!["data_source_id".to_string()],
        )]
    }
}

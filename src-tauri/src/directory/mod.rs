use crate::content::containers::HeterogeneousContentArray;
use crate::content::content_types::ContentType;
use crate::content::form::FormField;
use crate::error::DwataError;
use crate::workspace::configuration::{Configuration, ConfigurationData, ConfigurationSchema};
use glob::glob;
use serde::{Deserialize, Serialize};
use sqlx::SqliteConnection;
use std::collections::HashSet;
use std::path::PathBuf;
use ts_rs::TS;
use ulid::Ulid;

pub mod commands;
pub mod helpers;

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "APIFileNode",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
#[serde(rename_all(serialize = "camelCase"))]
pub(crate) struct FileNode {
    #[serde(skip_serializing)]
    base_path: Option<PathBuf>,

    relative_path: String,
    is_folder: bool,
    contents: Vec<HeterogeneousContentArray>,
}

impl FileNode {
    pub fn new(
        base_path: Option<PathBuf>,
        relative_path: String,
        is_folder: bool,
        contents: Vec<HeterogeneousContentArray>,
    ) -> Self {
        Self {
            base_path,
            relative_path,
            is_folder,
            contents,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Directory",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Directory {
    id: String,
    pub path: PathBuf,
    pub label: Option<String>,
    pub include_patterns: Vec<String>,
    pub exclude_patterns: Vec<String>,
}

impl Directory {
    pub fn new(
        path: &str,
        label: Option<&str>,
        include_patterns: Vec<&str>,
        exclude_patterns: Vec<&str>,
    ) -> Self {
        Directory {
            id: Ulid::new().to_string(),
            path: PathBuf::from(path),
            label: label.map(|x| x.to_string()),
            include_patterns: include_patterns.iter().map(|x| x.to_string()).collect(),
            exclude_patterns: exclude_patterns.iter().map(|x| x.to_string()).collect(),
        }
    }

    pub fn match_id(&self, folder_id: &str) -> bool {
        self.id == folder_id
    }

    pub fn get_id(&self) -> String {
        self.id.clone()
    }

    pub fn get_path(&self) -> PathBuf {
        self.path.clone()
    }

    pub fn get_file_list(&self) -> Vec<FileNode> {
        // Glob all the files in this directory
        let mut result: Vec<FileNode> = vec![];
        match glob(&self.path.join("**/*.md").to_string_lossy().to_string()) {
            Ok(paths) => {
                for entry in paths {
                    match entry {
                        Ok(file) => match file.strip_prefix(&self.path) {
                            Ok(relative_path) => {
                                if relative_path.to_str().unwrap() != "" {
                                    result.push(FileNode::new(
                                        None,
                                        relative_path.to_string_lossy().to_string(),
                                        file.is_dir(),
                                        vec![],
                                    ))
                                }
                            }
                            Err(_) => {}
                        },
                        Err(_) => {}
                    }
                }
            }
            Err(_) => {}
        }
        result
    }
}

impl Configuration for Directory {
    fn get_schema() -> ConfigurationSchema {
        ConfigurationSchema {
            name: "Directory".to_string(),
            description: "Directory containing files which match specified types".to_string(),
            fields: vec![
                FormField {
                    name: "path".to_string(),
                    label: "Path to Directory".to_string(),
                    description: Some(
                        "The directory from which you want to read files matching specified types"
                            .to_string(),
                    ),
                    field: (ContentType::Text, HashSet::new()),
                    is_required: Some(true),
                    is_editable: Some(true),
                },
                FormField {
                    name: "label".to_string(),
                    label: "Label".to_string(),
                    description: Some("An easy to remember label for this directory".to_string()),
                    field: (ContentType::Text, HashSet::new()),
                    is_required: Some(false),
                    is_editable: Some(true),
                },
                FormField {
                    name: "include_patters".to_string(),
                    label: "Include patterns".to_string(),
                    description: Some(
                        "File glob patterns to include (like in .gitignore file)".to_string(),
                    ),
                    field: (ContentType::Text, HashSet::new()),
                    is_required: Some(true),
                    is_editable: Some(true),
                },
            ],
        }
    }

    async fn list_configurations(
        db_connection: &mut SqliteConnection,
    ) -> Result<ConfigurationData, DwataError> {
    }

    async fn create_configuration(
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<String, DwataError> {
    }

    async fn update_configuration(
        id: &str,
        data: ConfigurationData,
        db_connection: &mut SqliteConnection,
    ) -> Result<bool, DwataError> {
    }
}

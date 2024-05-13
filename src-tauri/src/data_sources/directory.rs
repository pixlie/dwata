use crate::directory::FileNode;
use glob::glob;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use ts_rs::TS;
use ulid::Ulid;

#[derive(Clone, Debug, Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "APIFolderSource",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct FolderSource {
    id: String,
    path: PathBuf,
    label: Option<String>,
    include_patterns: Vec<String>,
    exclude_patterns: Vec<String>,
}

impl FolderSource {
    pub fn new(
        path: &str,
        label: Option<&str>,
        include_patterns: Vec<&str>,
        exclude_patterns: Vec<&str>,
    ) -> Self {
        FolderSource {
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

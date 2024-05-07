use ignore::Walk;
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

    pub fn get_id(&self) -> String {
        self.id.clone()
    }

    pub fn match_id(&self, folder_id: &str) -> bool {
        self.id == folder_id
    }

    pub fn get_file_list(&self) -> Vec<String> {
        // Glob all the files in this folder
        let mut result: Vec<String> = vec![];
        for entry in Walk::new(&self.path) {
            match entry {
                Ok(file) => result.push(file.path().display().to_string()),
                Err(_) => {}
            }
        }
        result
    }
}

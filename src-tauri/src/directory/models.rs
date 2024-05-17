use crate::content::containers::HeterogeneousContentArray;
use chrono::{DateTime, Utc};
use glob::glob;
use serde::{Deserialize, Serialize};
use sqlx::{prelude::FromRow, types::Json};
use std::path::PathBuf;
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "File",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
#[serde(rename_all(serialize = "camelCase"))]
pub(crate) struct File {
    #[serde(skip_serializing)]
    pub base_path: Option<PathBuf>,
    pub relative_path: String,
    pub is_directory: bool,
    pub contents: Vec<HeterogeneousContentArray>,
}

#[derive(Debug, Deserialize, Serialize, FromRow, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(
    export,
    rename = "Directory",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Directory {
    pub id: String,
    #[sqlx(try_from = "String")]
    pub path: PathBuf,
    pub label: Option<String>,
    #[ts(type = "Vec<String>")]
    pub include_patterns: Json<Vec<String>>,
    #[ts(type = "Vec<String>")]
    pub exclude_patterns: Json<Vec<String>>,
    #[ts(type = "String")]
    pub created_at: DateTime<Utc>,
}

impl Directory {
    pub fn get_file_list(&self) -> Vec<File> {
        // Glob all the files in this directory
        let mut result: Vec<File> = vec![];
        match glob(&self.path.join("**/*.md").to_string_lossy().to_string()) {
            Ok(paths) => {
                for entry in paths {
                    match entry {
                        Ok(file) => match file.strip_prefix(&self.path) {
                            Ok(relative_path) => {
                                if relative_path.to_str().unwrap() != "" {
                                    result.push(File {
                                        base_path: None,
                                        relative_path: relative_path.to_string_lossy().to_string(),
                                        is_directory: file.is_dir(),
                                        contents: vec![],
                                    })
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

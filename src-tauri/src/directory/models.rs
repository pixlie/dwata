use crate::content::containers::HeterogeneousContentArray;
use chrono::{DateTime, Utc};
use glob::glob;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use ts_rs::TS;
use ulid::Ulid;

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
    pub is_folder: bool,
    pub contents: Vec<HeterogeneousContentArray>,
}

// impl File {
//     pub fn new(
//         base_path: Option<PathBuf>,
//         relative_path: String,
//         is_folder: bool,
//         contents: Vec<HeterogeneousContentArray>,
//     ) -> Self {
//         Self {
//             base_path,
//             relative_path,
//             is_folder,
//             contents,
//         }
//     }
// }

#[derive(Clone, Debug, Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Directory",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Directory {
    pub id: String,
    pub path: PathBuf,
    pub label: Option<String>,
    pub include_patterns: Vec<String>,
    pub exclude_patterns: Vec<String>,
    #[ts(type = "string")]
    pub created_at: DateTime<Utc>,
}

impl Directory {
    // pub fn new(
    //     path: &str,
    //     label: Option<&str>,
    //     include_patterns: Vec<&str>,
    //     exclude_patterns: Vec<&str>,
    // ) -> Self {
    //     Directory {
    //         id: Ulid::new().to_string(),
    //         path: PathBuf::from(path),
    //         label: label.map(|x| x.to_string()),
    //         include_patterns: include_patterns.iter().map(|x| x.to_string()).collect(),
    //         exclude_patterns: exclude_patterns.iter().map(|x| x.to_string()).collect(),
    //     }
    // }

    pub fn match_id(&self, folder_id: &str) -> bool {
        self.id == folder_id
    }

    pub fn get_id(&self) -> String {
        self.id.clone()
    }

    pub fn get_path(&self) -> PathBuf {
        self.path.clone()
    }

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
                                    result.push(File::new(
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

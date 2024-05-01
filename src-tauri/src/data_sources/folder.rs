use std::{path::PathBuf, vec};

use ulid::Ulid;

pub struct FolderSource {
    id: String,
    label: Option<String>,
    path: PathBuf,
    include_patterns: Vec<String>,
    exclude_patterns: Vec<String>,
}

impl FolderSource {
    pub fn new(path: String, label: Option<String>) -> Self {
        FolderSource {
            id: Ulid::new().to_string(),
            label,
            path: PathBuf::from(path),
            include_patterns: vec![],
            exclude_patterns: vec![],
        }
    }

    pub fn get_id(&self) -> String {
        self.id.clone()
    }
}

pub mod commands;
mod helpers;

use comrak::nodes::{AstNode, NodeValue};
use comrak::{parse_document, Arena, Options};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "APIContentCode",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct Code {
    language: String,
    lines: Vec<(usize, String)>,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "APIContentImage",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct Image {
    url: String,
    caption: String,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "APIContentLink",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct Link {
    url: String,
    caption: String,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, rename = "APIFileContent", export_to = "../src/api_types/")]
pub(crate) enum Content {
    Heading(String),
    Paragraph(String),
    Image(Image),
    Link(Link),
    BulletList(Vec<String>),
    Code(Code),
}

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
    contents: Vec<(usize, Content)>,
}

impl FileNode {
    pub fn new(
        base_path: Option<PathBuf>,
        relative_path: String,
        is_folder: bool,
        contents: Vec<(usize, Content)>,
    ) -> Self {
        Self {
            base_path,
            relative_path,
            is_folder,
            contents,
        }
    }
}

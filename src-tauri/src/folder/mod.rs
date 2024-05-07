pub mod commands;

use serde::{Deserialize, Serialize};
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
#[ts(
    export,
    rename = "APIFileContent",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
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
    rename = "APIFile",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct File {
    relative_path: String,
    contents: Vec<(usize, Content)>,
}

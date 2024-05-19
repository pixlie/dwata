use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Image",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct Image {
    pub url: String,
    pub caption: Option<String>,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Link",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Link {
    pub url: String,
    pub caption: Option<String>,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Code",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub(crate) struct Code {
    pub language: String,
    pub lines: Vec<(usize, String)>,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, rename = "ContentType", export_to = "../src/api_types/")]
pub enum ContentType {
    Text,
    Image,
    Link,
    Code,
    FilePath,
    DateTime,
}

#[derive(Deserialize, Serialize, PartialEq, Eq, Hash, TS)]
#[ts(export, rename = "ContentSpec", export_to = "../src/api_types/")]
pub(crate) enum ContentSpec {
    // MinimumLength(usize),
    MaximumLength(usize),
    HeadingLevel(usize),
    // Text can be a prompt to AI model
    IsPrompt,
    // BulletPoints,
}

#[derive(Deserialize, Serialize)]
pub enum Content {
    Text(String),
    Image(Image),
    Link(Link),
    Code(Code),
    FilePath(PathBuf),
    DateTime(DateTime<Utc>),
}

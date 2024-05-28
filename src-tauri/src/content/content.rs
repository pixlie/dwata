use std::collections::HashMap;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Image",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Image {
    pub url: String,
    pub caption: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
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

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "Code",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct Code {
    pub language: String,
    pub lines: Vec<(usize, String)>,
}

#[derive(Deserialize, Serialize, PartialEq, Eq, Hash, TS)]
#[ts(export, rename = "TextType", export_to = "../src/api_types/")]
pub enum TextType {
    Email,
    Password,
    Default,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, rename = "ContentType", export_to = "../src/api_types/")]
pub enum ContentType {
    Text,
    TextArray,
    SingleChoice,
    Image,
    Link,
    Code,
    FilePath,
    DateTime,
}

#[derive(Default, Deserialize, Serialize, PartialEq, Eq, Hash, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ContentSpec {
    pub text_type: Option<TextType>,
    pub length_limits: Option<(usize, usize)>,
    pub choices: Option<Vec<(String, String)>>,
    // Text can be a prompt to AI model
    pub is_prompt: Option<bool>,
    // BulletPoints,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export, rename = "Content", export_to = "../src/api_types/")]
pub enum Content {
    Text(String),
    Image(Image),
    Link(Link),
    // Code(Code),
    // FilePath(PathBuf),
    DateTime(DateTime<Utc>),
}

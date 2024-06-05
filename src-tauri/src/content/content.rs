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
    SingleLine,
    MultiLine,
    Link,
    Code,
    FilePath,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, rename = "ContentType", export_to = "../src/api_types/")]
pub enum ContentType {
    Text,
    TextArray,
    SingleChoice,
    Image,
    DateTime,
}

#[derive(Deserialize, Serialize, PartialEq, Eq, Hash, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub struct ContentSpec {
    pub text_type: Option<TextType>,
    pub length_limits: Option<(usize, usize)>,
    pub choices: Option<Vec<(String, String)>>,
    // The frontend will call the provided function to get choices,
    // generally needed when choices come from a data source
    pub choices_from_function: Option<String>,
    // Text can be a prompt to AI model
    pub is_prompt: Option<bool>,
    // BulletPoints,
}

impl Default for ContentSpec {
    fn default() -> Self {
        Self {
            text_type: None,
            length_limits: None,
            choices: None,
            choices_from_function: None,
            is_prompt: None,
        }
    }
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

use super::content::{Content, ContentSpec, ContentType};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub type HeterogenousContent = (ContentType, ContentSpec, Content);

#[derive(Deserialize, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub struct HeterogeneousContentArray {
    pub contents: Vec<HeterogenousContent>,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, export_to = "../src/api_types/")]
pub struct HomogeneousContentArray {
    pub content_type: ContentType,
    pub content_type_spec: ContentSpec,
    pub contents: Vec<Content>,
}

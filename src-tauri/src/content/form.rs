use crate::content::content::{Content, ContentSpec, ContentType};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct FormField {
    // A unique identifier within a form or schema
    pub name: String,
    pub label: String,
    pub description: Option<String>,
    pub placeholder: Option<String>,
    pub content_type: ContentType,
    pub content_spec: ContentSpec,
    // Not required by default
    pub is_required: Option<bool>,
    // Editable by default
    pub is_editable: Option<bool>,
}

impl FormField {
    pub fn new(
        name: &str,
        label: &str,
        description: Option<&str>,
        content_type: ContentType,
        content_spec: ContentSpec,
        is_required: Option<bool>,
        is_editable: Option<bool>,
    ) -> Self {
        FormField {
            name: name.to_string(),
            label: label.to_string(),
            description: description.and_then(|x| Some(x.to_string())),
            placeholder: None,
            content_type,
            content_spec,
            is_required,
            is_editable,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export)]
pub enum FormFieldData {
    Single(Content),
    Array(Vec<Content>),
}

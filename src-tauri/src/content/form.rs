use crate::content::content::{Content, ContentSpec, ContentType};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(
    export,
    rename = "FormField",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
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
#[ts(export, rename = "FormFieldData", export_to = "../src/api_types/")]
pub enum FormFieldData {
    Single(Content),
    Array(Vec<Content>),
}

impl FormFieldData {
    pub fn from_string<T>(data: T) -> Self
    where
        T: ToString,
    {
        FormFieldData::Single(Content::Text(data.to_string()))
    }
}

impl FormFieldData {
    pub fn from_array_of_string<T>(data: Vec<T>) -> Self
    where
        T: ToString,
    {
        FormFieldData::Array(data.iter().map(|x| Content::Text(x.to_string())).collect())
    }
}

pub type FormData = HashMap<String, FormFieldData>;

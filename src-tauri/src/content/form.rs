use std::fmt::Display;

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
    pub is_hidden: Option<bool>,
    pub default_value: Option<Content>,
}

impl Default for FormField {
    fn default() -> Self {
        FormField {
            name: "field".to_string(),
            label: "Field".to_string(),
            description: None,
            placeholder: None,
            content_type: ContentType::Text,
            content_spec: ContentSpec::default(),
            is_required: Some(false),
            is_editable: Some(true),
            is_hidden: None,
            default_value: None,
        }
    }
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
            is_hidden: None,
            default_value: None,
        }
    }

    pub fn text_field<T: Display>(name: T, label: T) -> Self {
        FormField {
            name: name.to_string(),
            label: label.to_string(),
            ..Default::default()
        }
    }

    pub fn hidden_field<T: Display>(name: T) -> Self {
        FormField {
            name: name.to_string(),
            label: name.to_string(),
            content_type: ContentType::Text,
            content_spec: ContentSpec::default(),
            is_editable: Some(false),
            is_hidden: Some(true),
            ..Default::default()
        }
    }
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export)]
pub enum FormButtonType {
    Submit,
    Cancel,
}

#[derive(Deserialize, Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct FormButton {
    pub button_type: FormButtonType,
    pub label: String,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export)]
pub enum FormFieldData {
    Single(Content),
    Array(Vec<Content>),
}

use crate::content::content::{Content, ContentSpec, ContentType};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Serialize, TS)]
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
    pub field: (ContentType, ContentSpec),
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
        field: (ContentType, ContentSpec),
        is_required: Option<bool>,
        is_editable: Option<bool>,
    ) -> Self {
        FormField {
            name: name.to_string(),
            label: label.to_string(),
            description: description.and_then(|x| Some(x.to_string())),
            placeholder: None,
            field,
            is_required,
            is_editable,
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "FormFieldDataSingleOrArray",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub enum FormFieldDataSingleOrArray {
    Single(Content),
    Array(Vec<Content>),
}

#[derive(Deserialize, Serialize, TS)]
#[ts(
    export,
    rename = "FormFieldData",
    rename_all = "camelCase",
    export_to = "../src/api_types/"
)]
pub struct FormFieldData {
    pub name: String,
    pub data: FormFieldDataSingleOrArray,
}

impl FormFieldData {
    pub fn from_string<T>(name: &str, data: T) -> Self
    where
        T: ToString,
    {
        FormFieldData {
            name: name.to_string(),
            data: FormFieldDataSingleOrArray::Single(Content::Text(data.to_string())),
        }
    }
}

impl FormFieldData {
    pub fn from_array_of_string<T>(name: &str, data: Vec<T>) -> Self
    where
        T: ToString,
    {
        FormFieldData {
            name: name.to_string(),
            data: FormFieldDataSingleOrArray::Array(
                data.iter().map(|x| Content::Text(x.to_string())).collect(),
            ),
        }
    }
}

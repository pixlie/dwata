use crate::content::content_types::{Content, ContentSpec, ContentType};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
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
    pub field: (ContentType, HashSet<ContentSpec>),
    // Not required by default
    pub is_required: Option<bool>,
    // Editable by default
    pub is_editable: Option<bool>,
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
    pub data: Content,
}

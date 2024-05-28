use crate::ai::AiModel;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

pub(crate) enum APIToolParameterType {
    String,
    Number,
    Boolean,
}

pub(crate) struct APIToolParameter {
    name: String,
    parameter_type: APIToolParameterType,
    description: String,
}

pub(crate) struct APITool {
    name: String,
    description: String,
    parameters: Vec<APIToolParameter>,
    required: Vec<String>,
}

pub(crate) struct APIToolBuilder {
    name: Option<String>,
    description: Option<String>,
    parameters: Vec<APIToolParameter>,
    required: Vec<String>,
}

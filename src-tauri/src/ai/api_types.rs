use crate::ai::AiModel;
use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct APIAIModel {
    api_name: String,
    label: String,
    context_window: Option<usize>,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct APIAIProvider {
    name: String,
    ai_model_list: Vec<APIAIModel>,
}

impl APIAIProvider {
    pub fn new(name: String, ai_model_list: &Vec<AiModel>) -> Self {
        Self {
            name,
            ai_model_list: ai_model_list
                .iter()
                .map(|x| APIAIModel {
                    api_name: x.api_name.clone(),
                    label: x.label.clone(),
                    context_window: x.context_window,
                })
                .collect(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[serde(rename_all(serialize = "camelCase"))]
#[ts(export, rename_all = "camelCase", export_to = "../src/api_types/")]
pub(crate) struct APIAIIntegration {
    id: String,
    ai_provider: String,
    // We may not have API key for team users where configuration is centrally managed
    api_key: Option<String>,
    display_label: Option<String>,
}

impl APIAIIntegration {
    pub fn new(
        id: String,
        ai_provider: String,
        api_key: Option<String>,
        display_label: Option<String>,
    ) -> Self {
        Self {
            id,
            ai_provider,
            api_key,
            display_label,
        }
    }
}

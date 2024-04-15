use crate::ai::Tool;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct Usage {
    pub(crate) prompt_tokens: i64,
    pub(crate) completion_tokens: i64,
    pub(crate) total_tokens: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct Message {
    pub(crate) role: String,
    pub(crate) content: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct ChatCompletionChoice {
    pub(crate) index: i64,
    pub(crate) message: Message,
    pub(crate) logprobs: Option<LogProb>,
    pub(crate) finish_reason: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct OpenAIChatResponse {
    pub(crate) id: String,
    pub(crate) object: String,
    pub(crate) created: i64,
    pub(crate) model: String,
    pub(crate) system_fingerprint: String,
    pub(crate) choices: Vec<ChatCompletionChoice>,
    pub(crate) usage: Usage,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct TopLogProb {
    pub(crate) token: String,
    pub(crate) logprob: i64,
    pub(crate) bytes: Option<Vec<i64>>,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct LogProbContent {
    pub(crate) token: String,
    pub(crate) logprob: i64,
    pub(crate) bytes: Option<Vec<i64>>,
    pub(crate) top_logprobs: Vec<TopLogProb>,
}

#[derive(Serialize, Deserialize, Debug)]
pub(crate) struct LogProb {
    pub(crate) content: Option<Vec<LogProbContent>>,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct ChatRequestMessage {
    pub(crate) role: String,
    pub(crate) content: String,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct OpenAIChatRequest {
    pub(crate) model: String,
    pub(crate) messages: Vec<ChatRequestMessage>,
}

#[derive(Deserialize, Serialize)]
pub(crate) struct OpenAIToolParameter {
    #[serde(rename(serialize = "type"))]
    pub(crate) _type: String,
    pub(crate) description: String,
}

#[derive(Deserialize, Serialize)]
pub(crate) struct OpenAIToolParameters {
    #[serde(rename(serialize = "type"))]
    pub(crate) _type: String,
    pub(crate) properties: HashMap<String, OpenAIToolParameter>,
}

#[derive(Deserialize, Serialize)]
pub(crate) struct OpenAIToolFunction {
    pub(crate) name: String,
    pub(crate) description: String,
    pub(crate) parameters: OpenAIToolParameters,
}

#[derive(Deserialize, Serialize)]
pub(crate) struct OpenAITool {
    #[serde(rename(serialize = "type"))]
    pub(crate) _type: String,
    pub(crate) function: OpenAIToolFunction,
}

#[derive(Deserialize, Serialize)]
pub(crate) struct OpenAITools {
    pub(crate) tools: Vec<OpenAITool>,
}

impl OpenAITools {
    pub(crate) fn from_tool_list(tool_list: Vec<Tool>) -> Self {
        let mut tools: Vec<OpenAITool> = Vec::new();
        for tool in tool_list {
            tools.push(OpenAITool {
                _type: "function".to_string(),
                function: OpenAIToolFunction {
                    name: tool.name.clone(),
                    description: tool.description.clone(),
                    parameters: OpenAIToolParameters {
                        _type: "object".to_string(),
                        properties: tool
                            .parameters
                            .iter()
                            .map(|x| OpenAIToolParameter {
                                _type: x.parameter_type.to_string(),
                                description: x.description.clone(),
                            })
                            .collect(),
                    }
                },
            });
        }
        OpenAITools { tools }
    }
}

use serde::{Deserialize, Serialize};

use super::openai::ChatRequestMessage;

#[derive(Serialize)]
pub struct OllamaTextGenerationRequest {
    pub model: String,
    pub messages: Vec<ChatRequestMessage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stream: Option<bool>,
}

/// Here is an example of a response from Ollama:
/// {
///   "model": "ollama-7b-ggml",
///   "created_at": "2023-12-12T14:13:43.416799Z",
///   "message": {
///     "role": "assistant",
///     "content": "Hello! How are you today?"
///   },
///   "done": true,
///   "total_duration": 5191566416,
///   "load_duration": 2154458,
///   "prompt_eval_count": 26,
///   "prompt_eval_duration": 383809000,
///   "eval_count": 298,
///   "eval_duration": 4799921000
/// }
#[derive(Deserialize)]
pub struct OllamaTextGenerationResponse {
    pub model: String,
    pub created_at: String,
    pub message: ChatRequestMessage,
    pub done: bool,
    pub total_duration: u64,
    pub load_duration: u64,
    pub prompt_eval_count: u64,
    pub prompt_eval_duration: u64,
    pub eval_count: u64,
    pub eval_duration: u64,
}

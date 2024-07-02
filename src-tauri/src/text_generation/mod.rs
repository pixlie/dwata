use crate::ai_integration::providers::ollama::{
    OllamaTextGenerationRequest, OllamaTextGenerationResponse,
};
use crate::chat::Role;
use crate::{
    ai_integration::{
        models::AIModel, providers::openai::OpenAIChatRequest, AIIntegration, AIProvider,
    },
    error::DwataError,
};
use log::{error, info};
use openai::types::CreateChatCompletionResponse;
use reqwest::RequestBuilder;
use serde::{Deserialize, Serialize};

pub mod commands;
pub mod helpers;

pub enum TextGenerationResponse {
    Message(String),
    // Tool(Vec<ChatToolResponse>),
}

#[derive(Deserialize, Serialize)]
pub struct TextGenerationRequest {
    pub role: Role,
    pub content: String,
}

impl AIIntegration {
    // Chat related
    pub fn get_text_generation_url(&self) -> Result<String, DwataError> {
        match self.ai_provider {
            AIProvider::OpenAI => Ok("https://api.openai.com/v1/chat/completions".to_string()),
            AIProvider::Groq => Ok("https://api.groq.com/openai/v1/chat/completions".to_string()),
            AIProvider::Ollama => Ok("http://localhost:11434/api/chat".to_string()),
            // AIProvider::Anthropic => Some("https://api.anthropic.com/v1/messages".to_string()),
            // AIProvider::MistralAI => Some("https://api.mistral.ai/v1/chat/completions".to_string()),
        }
    }

    pub fn build_text_generation_https_request(
        &self,
        ai_model: AIModel,
        messages_to_send: Vec<TextGenerationRequest>,
    ) -> Result<RequestBuilder, DwataError> {
        let chat_url = self.get_text_generation_url()?;
        let https_client = reqwest::Client::new();
        match self.ai_provider {
            AIProvider::OpenAI | AIProvider::Groq => {
                let payload: OpenAIChatRequest = OpenAIChatRequest {
                    model: ai_model.api_name,
                    messages: messages_to_send,
                    // tools: vec![],
                };
                let request_builder: RequestBuilder = https_client
                    .post(chat_url)
                    .header(
                        "Authorization",
                        format!("Bearer {}", self.api_key.as_ref().unwrap()),
                    )
                    .json(&payload);
                info!("{}", serde_json::to_string_pretty(&payload).unwrap());
                Ok(request_builder)
            }
            AIProvider::Ollama => {
                let payload: OllamaTextGenerationRequest = OllamaTextGenerationRequest {
                    model: ai_model.api_name,
                    messages: messages_to_send,
                    stream: Some(false),
                };
                let request_builder: RequestBuilder = https_client.post(chat_url).json(&payload);
                info!(
                    "Received a text generation request, sending to Ollama:\n{}",
                    serde_json::to_string_pretty(&payload).unwrap()
                );
                Ok(request_builder)
            }
        }
    }

    pub async fn generate_text_with_ai(
        &self,
        ai_model: AIModel,
        messages_to_send: Vec<TextGenerationRequest>,
    ) -> Result<TextGenerationResponse, DwataError> {
        match self.ai_provider {
            AIProvider::OpenAI => {
                self.generate_text_with_ai_openai_compatible(ai_model, messages_to_send)
                    .await
            }
            AIProvider::Groq => {
                self.generate_text_with_ai_openai_compatible(ai_model, messages_to_send)
                    .await
            }
            AIProvider::Ollama => {
                self.generate_text_with_ai_ollama(ai_model, messages_to_send)
                    .await
            } // AIProvider::Anthropic => self.generate_text_with_ai_anthropic(ai_model, message_to_send).await,
              // AIProvider::MistralAI => self.generate_text_with_ai_mistral(ai_model, message_to_send).await,
        }
    }
}

/// OpenAI compatible API
impl AIIntegration {
    pub async fn generate_text_with_ai_openai_compatible(
        &self,
        ai_model: AIModel,
        messages_to_send: Vec<TextGenerationRequest>,
        // tool_list: Vec<Tool>,
    ) -> Result<TextGenerationResponse, DwataError> {
        let request = self.build_text_generation_https_request(ai_model, messages_to_send)?; //, tool_list);
        let response = request.send().await;
        match response {
            Ok(response) => {
                if response.status().is_success() {
                    match response.json::<CreateChatCompletionResponse>().await {
                        Ok(response) => {
                            if response.choices[0].message.tool_calls.is_some() {
                                // We have received a tool call
                                // Ok(TextGenerationResponse::Tool(
                                //     response.choices[0]
                                //         .message
                                //         .tool_calls
                                //         .clone()
                                //         .unwrap()
                                //         .iter()
                                //         .map(|x| ChatToolResponse {
                                //             tool_name: x.function.name.clone(),
                                //             tool_type: match x.r#type {
                                //                 Type::Function => "function".to_string(),
                                //             },
                                //             arguments: x.function.arguments.clone(),
                                //         })
                                //         .collect(),
                                // ))
                                return Err(DwataError::ToolUseNotSupported);
                            } else {
                                Ok(TextGenerationResponse::Message(
                                    response.choices[0]
                                        .message
                                        .content
                                        .clone()
                                        .unwrap_or_else(|| "".to_string()),
                                ))
                            }
                        }
                        Err(err) => {
                            error!("Error from OpenAI (compatible) request\nError: {}", err);
                            Err(DwataError::CouldNotConnectToAIProvider)
                        }
                    }
                } else {
                    error!(
                        "Error from OpenAI (compatible) request\nError: {}\n{}",
                        response.status(),
                        response.text().await.unwrap()
                    );
                    Err(DwataError::CouldNotConnectToAIProvider)
                }
            }
            Err(err) => {
                error!("Error from OpenAI (compatible) request\nError: {}", err);
                Err(DwataError::CouldNotConnectToAIProvider)
            }
        }
    }
}

/// Ollama API
impl AIIntegration {
    pub async fn generate_text_with_ai_ollama(
        &self,
        ai_model: AIModel,
        messages_to_send: Vec<TextGenerationRequest>,
    ) -> Result<TextGenerationResponse, DwataError> {
        let request = self.build_text_generation_https_request(ai_model, messages_to_send)?; //, tool_list);
        let response = request.send().await;
        match response {
            Ok(response) => {
                if response.status().is_success() {
                    match response.json::<OllamaTextGenerationResponse>().await {
                        Ok(response) => Ok(TextGenerationResponse::Message(
                            response.message.content.clone(),
                        )),
                        Err(err) => {
                            error!("Error from Ollama request\nError: {}", err);
                            Err(DwataError::CouldNotConnectToAIProvider)
                        }
                    }
                } else {
                    error!(
                        "Error from Ollama request\nError: {}\n{}",
                        response.status(),
                        response.text().await.unwrap()
                    );
                    Err(DwataError::CouldNotConnectToAIProvider)
                }
            }
            Err(err) => {
                error!("Error from Ollama request\nError: {}", err);
                Err(DwataError::CouldNotConnectToAIProvider)
            }
        }
    }
}

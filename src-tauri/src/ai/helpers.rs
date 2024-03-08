use super::providers::openai::{ChatRequestMessage, OpenAIChatRequest, OpenAIChatResponse};
use super::AiProvider;
use crate::chat::ChatReply;
use crate::error::DwataError;
use reqwest;

// pub async fn check_ai_intro_message(ai_provider: AiProvider) -> Result<ChatItem, DwataError> {
//     let chat_text = r#"
//     You are a data analyst who is helping me in finding insights in my business. Please feel free
//     to ask me questions to help you understand my business.
//     "#;
//     let (chat_url, api_key) = match ai_provider {
//         AiProvider::OpenAI(x) => ("https://api.openai.com/v1/chat/completions", x.api_key),
//         AiProvider::Groq(x) => ("https://api.groq.com/openai/v1/chat/completions", x.api_key),
//     };
//     let payload: OpenAIChatRequest = OpenAIChatRequest {
//         model: "gpt-3.5-turbo".to_string(),
//         messages: vec![
//             ChatRequestMessage {
//                 role: "system".to_string(),
//                 content: chat_text.to_string(),
//             },
//             ChatRequestMessage {
//                 role: "user".to_string(),
//                 content: "Hello!".to_string(),
//             },
//         ],
//     };
//     let https_client = reqwest::Client::new();
//     let request = https_client
//         .post(chat_url)
//         .header("Authorization", format!("Bearer {}", api_key))
//         .json::<OpenAIChatRequest>(&payload)
//         .send()
//         .await;
//     match request {
//         Ok(response) => {
//             if response.status().is_success() {
//                 let payload = response.json::<OpenAIChatResponse>().await;
//                 println!("{:?}", payload);
//                 Ok(ChatItem::new(1, "text".to_string()))
//             } else {
//                 println!(
//                     "Error: {}\n{}",
//                     response.status(),
//                     response.text().await.unwrap()
//                 );
//                 Err(DwataError::CouldNotConnectToAiProvider)
//             }
//         }
//         Err(_) => Err(DwataError::CouldNotConnectToAiProvider),
//     }
// }

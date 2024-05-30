use super::AIProvider;
use std::collections::HashSet;
use url::Url;

pub enum AIModelFeatures {
    Chat,
    Embedding,
    Vision,
}

pub enum AIModelDeveloper {
    SameAsProvider,
    OpenAI,
    Anthropic,
    Mistral,
    Meta,
    Google,
}

impl AIModelFeatures {
    pub fn hashset_from_vec_of_str(vec: Vec<&str>) -> HashSet<AIModelFeatures> {
        let mut result: HashSet<AIModelFeatures> = HashSet::new();
        for v in vec {
            match v {
                "chat" => {
                    result.insert(AIModelFeatures::Chat);
                }
                "embedding" => {
                    result.insert(AIModelFeatures::Embedding);
                }
                "vision" => {
                    result.insert(AIModelFeatures::Vision);
                }
                _ => {}
            }
        }
        result
    }
}

pub struct AIModel {
    pub label: String,
    pub ai_provider: AIProvider,
    pub developer: AIModelDeveloper,
    pub features: HashSet<AIModelFeatures>,

    pub api_name: String,
    pub latest_version_api_name: Option<String>,

    pub context_window: Option<i32>,
    // Prices are in US cents
    pub price_per_million_input_tokens: Option<i32>,
    pub price_per_million_output_tokens: Option<i32>,
    pub link_to_model_documentation: Option<Url>,
}

impl AIModel {
    pub fn new(
        label: &str,
        ai_provider: AIProvider,
        developer: AIModelDeveloper,
        provides: HashSet<AIModelFeatures>,
        api_name: &str,
        latest_version_api_name: Option<&str>,
        context_window: Option<i32>,
        price_per_million_input_tokens: Option<i32>,
        price_per_million_output_tokens: Option<i32>,
        link_to_model_documentation: Option<&str>,
    ) -> Self {
        AIModel {
            label: label.to_string(),
            ai_provider,
            developer,
            features: provides,
            api_name: api_name.to_string(),
            latest_version_api_name: latest_version_api_name.map(|x| x.to_string()),
            context_window,
            price_per_million_input_tokens,
            price_per_million_output_tokens,
            link_to_model_documentation: link_to_model_documentation
                .and_then(|x| Url::parse(x).ok()),
        }
    }
}

impl AIProvider {
    pub fn get_models_for_openai(&self) -> Vec<AIModel> {
        let mut models: Vec<AIModel> = vec![];
        models.push(AIModel::new(
            "GPT-3.5 Turbo",
            AIProvider::OpenAI,
            AIModelDeveloper::SameAsProvider,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat"]),
            "gpt-3.5-turbo",
            Some("gpt-3.5-turbo-0125"),
            Some(16_385),
            Some(0),
            Some(0),
            None,
        ));
        models.push(AIModel::new(
            "GPT-4 Turbo",
            AIProvider::OpenAI,
            AIModelDeveloper::SameAsProvider,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat", "vision"]),
            "gpt-4-turbo",
            Some("gpt-4-turbo-2024-04-09"),
            Some(128_000),
            Some(0),
            Some(0),
            None,
        ));
        models.push(AIModel::new(
            "GPT-4o",
            AIProvider::OpenAI,
            AIModelDeveloper::SameAsProvider,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat", "vision"]),
            "gpt-4o",
            Some("gpt-4o-2024-05-13"),
            Some(128_000),
            Some(0),
            Some(0),
            None,
        ));
        models
    }
}

impl AIProvider {
    pub fn get_models_for_groq(&self) -> Vec<AIModel> {
        let mut models: Vec<AIModel> = vec![];
        models.push(AIModel::new(
            "LLaMA3 8b",
            AIProvider::Groq,
            AIModelDeveloper::Meta,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat"]),
            "llama3-8b-8192",
            None,
            Some(8_192),
            None,
            None,
            None,
        ));
        models.push(AIModel::new(
            "LLaMA3 70b",
            AIProvider::Groq,
            AIModelDeveloper::Meta,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat"]),
            "llama3-70b-8192",
            None,
            Some(8_192),
            None,
            None,
            None,
        ));
        models.push(AIModel::new(
            "Mixtral 8x7b",
            AIProvider::Groq,
            AIModelDeveloper::Mistral,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat"]),
            "mixtral-8x7b-32768",
            None,
            Some(32_768),
            None,
            None,
            None,
        ));
        models.push(AIModel::new(
            "Gemma 7b",
            AIProvider::Groq,
            AIModelFeatures::hashset_from_vec_of_str(vec!["chat"]),
            "gemma-7b-it",
            None,
            Some(8_192),
            None,
            None,
            None,
        ));
        models
    }
}

impl AIProvider {
    pub fn get_models_for_anthropic(&self) -> Vec<AIModel> {
        vec![]
    }
}

impl AIProvider {
    pub fn get_models_for_ollama(&self) -> Vec<AIModel> {
        vec![]
    }
}

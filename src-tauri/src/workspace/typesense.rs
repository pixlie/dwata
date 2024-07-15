use crate::error::DwataError;
use log::info;
use reqwest;
use serde::Serialize;

#[derive(Serialize, Default)]
pub struct TypesenseField {
    pub name: String,
    #[serde(rename = "type")]
    pub field_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub facet: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub store: Option<bool>,
}

#[derive(Serialize)]
pub struct TypesenseCollection {
    pub name: String,
    pub fields: Vec<TypesenseField>,
    pub default_sorting_field: Option<String>,
}

pub trait TypesenseSearchable {
    async fn get_collection_name(&self) -> String;

    async fn get_collection_schema(&self) -> Result<TypesenseCollection, DwataError>;

    async fn get_json_lines(&self) -> Result<Vec<String>, DwataError>;

    async fn delete_collection(&self) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .delete(format!(
                "{}/collections/{}",
                typesense_url,
                self.get_collection_name().await
            ))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .send()
            .await?;

        info!(
            "Deleted collection in Typesense, API response status: {}",
            response.status(),
        );
        Ok(())
    }

    async fn create_collection_in_typesense(&self) -> Result<(), DwataError> {
        self.delete_collection().await?;
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .post(format!("{}/collections", typesense_url,))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .json(&self.get_collection_schema().await?)
            .send()
            .await?;

        info!(
            "Created collection in Typesense, API response status: {}, using schema: {}",
            response.status(),
            serde_json::to_string_pretty(&self.get_collection_schema().await?).unwrap()
        );
        Ok(())
    }

    async fn index_in_typesense(&self) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .post(format!(
                "{}/collections/{}/documents/import?action=upsert",
                typesense_url,
                self.get_collection_name().await
            ))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .body(self.get_json_lines().await?.join("\n"))
            .send()
            .await?;

        info!(
            "Indexed in Typesense, API response status: {}",
            response.status()
        );
        Ok(())
    }

    async fn retrieve_collection(&self) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .get(format!(
                "{}/collections/{}",
                typesense_url,
                self.get_collection_name().await
            ))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .send()
            .await?;

        info!(
            "Retrieved collection in Typesense, API response status: {}\n Result: {}",
            response.status(),
            response.text().await.unwrap()
        );
        Ok(())
    }

    async fn search_in_typesense(&self, query: String) -> Result<(), DwataError> {
        self.retrieve_collection().await?;
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .get(format!(
                "{}/collections/{}/documents/search",
                typesense_url,
                self.get_collection_name().await
            ))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .query(&[
                ("q", query),
                ("query_by", "subject,from,body_text".to_string()),
            ])
            .send()
            .await?;

        info!(
            "Searched in Typesense, API response status: {}\n Results: {}",
            response.status(),
            response.text().await.unwrap()
        );
        Ok(())
    }
}

use crate::email::SearchableEmail;
use crate::error::DwataError;
use log::info;
use reqwest;
use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use ts_rs::TS;

#[derive(Serialize)]
pub struct TypesenseEmbeddingModelConfig {
    pub model_name: String,
}

#[derive(Serialize)]
pub struct TypesenseEmbedding {
    pub from: Vec<String>,
    pub model_config: TypesenseEmbeddingModelConfig,
}

#[derive(Serialize, Default)]
pub struct TypesenseField {
    pub name: String,
    #[serde(rename = "type")]
    pub field_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub facet: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub store: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub embed: Option<TypesenseEmbedding>,
}

#[derive(Serialize)]
pub struct TypesenseCollection {
    pub name: String,
    pub fields: Vec<TypesenseField>,
    pub default_sorting_field: Option<String>,
}

pub trait TypesenseSearchable {
    async fn get_collection_name(&self, app: AppHandle) -> Result<String, DwataError>;

    async fn get_collection_schema(
        &self,
        app: AppHandle,
    ) -> Result<TypesenseCollection, DwataError>;

    async fn get_json_lines(&self, app: AppHandle) -> Result<Vec<String>, DwataError>;

    async fn delete_collection(&self, app: AppHandle) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .delete(format!(
                "{}/collections/{}",
                typesense_url,
                self.get_collection_name(app).await?
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

    async fn create_collection_in_typesense(&self, app: AppHandle) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let collection_schema = self.get_collection_schema(app).await?;
        let response = client
            .post(format!("{}/collections", typesense_url,))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .json(&collection_schema)
            .send()
            .await?;

        info!(
            "Created collection in Typesense, API response status: {}, using schema: {}",
            response.status(),
            serde_json::to_string_pretty(&collection_schema).unwrap()
        );
        Ok(())
    }

    async fn index_in_typesense(&self, app: AppHandle) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";

        // We index in batches of 25 at a time
        for lines in self.get_json_lines(app.clone()).await?.chunks(25) {
            let response = client
                .post(format!(
                    "{}/collections/{}/documents/import?action=upsert",
                    typesense_url,
                    self.get_collection_name(app.clone()).await?
                ))
                .header("Content-Type", "application/json")
                .header("X-TYPESENSE-API-KEY", typesense_api_key)
                .body(lines.join("\n"))
                .send()
                .await?;

            info!(
                "Indexed in Typesense, API response status: {}",
                response.status()
            );
        }

        Ok(())
    }

    async fn retrieve_collection(&self, app: AppHandle) -> Result<(), DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .get(format!(
                "{}/collections/{}",
                typesense_url,
                self.get_collection_name(app).await?
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

    async fn search_in_typesense(
        &self,
        query: String,
        app: AppHandle,
    ) -> Result<TypesenseSearchResult, DwataError> {
        let client = reqwest::Client::new();
        let typesense_url = "http://localhost:8108";
        let typesense_api_key = "TYPESENSE_LOCAL";
        let response = client
            .get(format!(
                "{}/collections/{}/documents/search",
                typesense_url,
                self.get_collection_name(app).await?
            ))
            .header("Content-Type", "application/json")
            .header("X-TYPESENSE-API-KEY", typesense_api_key)
            .query(&[
                ("q", query),
                ("query_by", "subject".to_string()),
                ("exclude_fields", "embedding".to_string()),
                ("per_page", "100".to_string()),
            ])
            .send()
            .await?;
        let results = response.json::<TypesenseSearchResult>().await.unwrap();

        info!("Searched in Typesense; found {} results", results.found);
        Ok(results)
    }
}

// #[derive(Deserialize, Serialize, TS)]
// #[ts(export)]
// pub struct TypesenseSearchResponse {
//     pub results: Vec<TypesenseSearchResult>,
// }

#[derive(Deserialize)]
pub struct TypesenseSearchResult {
    pub found: i64,
    pub hits: Vec<TypesenseSearchResultHit>,
}

#[derive(Deserialize, Serialize, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct TypesenseSearchResultHit {
    pub document: SearchableEmail,
}

#[derive(Serialize, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct SearchResult {
    #[ts(type = "number")]
    pub found: i64,
    pub hits: Vec<SearchCollection>,
}

#[derive(Serialize, TS)]
#[ts(export, rename_all = "camelCase")]
pub struct SearchCollection {
    pub collection_name: String,
    pub hits: Vec<TypesenseSearchResultHit>,
}

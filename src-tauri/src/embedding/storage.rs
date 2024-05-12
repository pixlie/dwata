use crate::data_sources::database::DatabaseType;
use crate::data_sources::{Database, DatabaseSource};
use crate::error::DwataError;
use crate::workspace::Config;
use qdrant_client::qdrant::{PointId, PointStruct};
use qdrant_client::{
    client::QdrantClient,
    qdrant::{CreateCollection, Distance, VectorParams, VectorsConfig},
};
use std::collections::HashMap;

pub async fn create_collection_in_qdrant(config: &mut Config) -> Result<(), DwataError> {
    let client = QdrantClient::from_url("localhost:6334").build().unwrap();
    match client
        .create_collection(&CreateCollection {
            collection_name: "default".to_string(),
            vectors_config: Some(VectorsConfig {
                config: Some(Config::Params(VectorParams {
                    size: 100,
                    distance: Distance::Cosine.into(),
                    on_disk: Some(true),
                    ..Default::default()
                })),
            }),
            ..Default::default()
        })
        .await
    {
        Ok(_) => {
            // We store this collection information in our config
            config.add_database_source(DatabaseSource::new(
                DatabaseType::Qdrant(Database::new(
                    "",
                    None,
                    "localhost",
                    Some("6334"),
                    "default",
                )),
                Some("Embeddings".to_string()),
            ));
            config.sync_to_file()
        }
        Err(_) => Err(DwataError::CouldNotCreateDatabase),
    }
}

pub async fn store_embedding_in_qdrant(
    text_id: String,
    embedding_vec: Vec<f32>,
) -> Result<(), DwataError> {
    let client = QdrantClient::from_url("localhost:6334").build().unwrap();

    let point = PointStruct {
        id: Some(PointId::from(text_id)),
        vectors: Some(embedding_vec.into()),
        payload: HashMap::new(),
    };

    match client
        .upsert_points_blocking("default".to_string(), None, vec![point])
        .await
    {
        Ok(_) => Ok(()),
        Err(_) => Err(DwataError::CouldNotConnectToDatabase),
    }
}

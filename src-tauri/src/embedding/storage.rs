use crate::data_sources::database::DatabaseType;
use crate::data_sources::{Database, DatabaseSource};
use crate::error::DwataError;
use crate::workspace::Config;
use qdrant_client::qdrant::{vectors_config, PointId, PointStruct};
use qdrant_client::{
    client::QdrantClient,
    qdrant::{CreateCollection, Distance, VectorParams, VectorsConfig},
};
use std::collections::HashMap;

pub async fn create_collection_in_qdrant(config: &mut Config) -> Result<(), DwataError> {
    let client = match QdrantClient::new(None) {
        Ok(client) => client,
        Err(_) => {
            println!("Could not connect to Qdrant");
            return Err(DwataError::CouldNotConnectToDatabase);
        }
    };

    let is_embeddings_configured = config.data_source_list.iter().any(|x| match x.source {
        DatabaseType::Qdrant(Database { ref name, .. }) => name == "dwata_embeddings",
        _ => false,
    });

    if is_embeddings_configured {
        return Ok(());
    }

    match client
        .create_collection(&CreateCollection {
            collection_name: "dwata_embeddings".to_string(),
            vectors_config: Some(VectorsConfig {
                config: Some(vectors_config::Config::Params(VectorParams {
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
            config.data_source_list.push(DatabaseSource::new(
                DatabaseType::Qdrant(Database::new(
                    "",
                    None,
                    "localhost",
                    Some("6334"),
                    "dwata_embeddings",
                )),
                Some("Embeddings".to_string()),
            ));
            config.sync_to_file()
        }
        Err(error) => {
            println!(
                "Could not create embeddings collection, {}",
                error.to_string()
            );
            Err(DwataError::CouldNotCreateDatabase)
        }
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
        .upsert_points_blocking("default".to_string(), None, vec![point], None)
        .await
    {
        Ok(_) => Ok(()),
        Err(_) => Err(DwataError::CouldNotConnectToDatabase),
    }
}

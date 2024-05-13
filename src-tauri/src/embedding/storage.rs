use crate::data_sources::database::DatabaseType;
use crate::data_sources::{Database, DatabaseSource};
use crate::error::DwataError;
use crate::workspace::Config;
use qdrant_client::qdrant::{
    vectors_config, vectors_config_diff, PointId, PointStruct, VectorParamsDiff, VectorsConfigDiff,
};
use qdrant_client::{
    client::QdrantClient,
    qdrant::{CreateCollection, Distance, Value, VectorParams, VectorsConfig},
};
use std::collections::HashMap;
use uuid::Uuid;

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
        match client
            .delete_collection("dwata_embeddings".to_string())
            .await
        {
            Ok(_) => {}
            Err(error) => {
                println!("{}", error);
                return Err(DwataError::CouldNotConnectToDatabase);
            }
        }
        match client
            .create_collection(&CreateCollection {
                collection_name: "dwata_embeddings".to_string(),
                vectors_config: Some(VectorsConfig {
                    config: Some(vectors_config::Config::Params(VectorParams {
                        size: 1536,
                        distance: Distance::Cosine.into(),
                        on_disk: Some(true),
                        ..Default::default()
                    })),
                }),
                ..Default::default()
            })
            .await
        {
            Ok(_) => {}
            Err(error) => {
                println!("{}", error);
                return Err(DwataError::CouldNotConnectToDatabase);
            }
        }
        return Ok(());
    }

    match client
        .create_collection(&CreateCollection {
            collection_name: "dwata_embeddings".to_string(),
            vectors_config: Some(VectorsConfig {
                config: Some(vectors_config::Config::Params(VectorParams {
                    size: 1536,
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
    embedding_vec: Vec<f32>,
    paragraph_context: HashMap<String, Value>,
) -> Result<(), DwataError> {
    let client = match QdrantClient::new(None) {
        Ok(client) => client,
        Err(_) => {
            println!("Could not connect to Qdrant");
            return Err(DwataError::CouldNotConnectToDatabase);
        }
    };

    let point = PointStruct {
        id: Some(PointId::from(Uuid::new_v4().to_string())),
        vectors: Some(embedding_vec.into()),
        payload: paragraph_context,
    };

    match client
        .upsert_points_blocking("dwata_embeddings".to_string(), None, vec![point], None)
        .await
    {
        Ok(_) => Ok(()),
        Err(error) => {
            println!("{}", error);
            Err(DwataError::CouldNotConnectToDatabase)
        }
    }
}

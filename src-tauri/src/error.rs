use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub enum DwataError {
    // External Database sources
    DatabaseNotFound,
    CouldNotConnectToDatabase,
    CouldNotQueryDatabase,
    CouldNotCreateDatabase,

    // Workspace and configuration
    ModuleNotFound,

    // AI providers/models/features
    InvalidAIProvider,
    CouldNotConnectToAIProvider,
    CouldNotGenerateEmbedding,
    FeatureNotAvailableWithAIProvider,

    // Internal SQLite DB for Dwata
    CouldNotCreateDwataDB,
    CouldNotConnectToDwataDB,
    CouldNotInsertToDwataDB,
    CouldNotUpdateDwataDB,
    CouldNotFetchRowsFromDwataDB,

    // Integrated vector DB
    CouldNotConnectToVectorDB,

    // Chat context related
    CouldNotFindNode,

    // Directory related
    CouldNotOpenDirectory,
}

impl From<sqlx::Error> for DwataError {
    fn from(err: sqlx::Error) -> Self {
        println!("{:?}", err);
        DwataError::CouldNotQueryDatabase
    }
}

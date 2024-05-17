#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum DwataError {
    // Database related
    DatabaseNotFound,
    CouldNotConnectToDatabase,
    CouldNotQueryDatabase,
    CouldNotCreateDatabase,

    // Config related
    CouldNotLockConfig,
    CouldNotWriteConfig,
    CouldNotLoadAiIntegration,

    // AI API related
    InvalidAiProvider,
    CouldNotConnectToAiProvider,
    CouldNotGenerateEmbedding,

    // Internal SQLite DB related
    CouldNotCreateAppDatabase,
    CouldNotConnectToAppDatabase,
    CouldNotInsertToAppDatabase,
    CouldNotUpdateAddDatabase,
    CouldNotFetchRowsFromAppDatabase,

    // Chat context related
    CouldNotFindNode,

    // Folder related
    CouldNotOpenFolder,
}

impl From<sqlx::Error> for DwataError {
    fn from(err: sqlx::Error) -> Self {
        println!("{:?}", err);
        DwataError::CouldNotQueryDatabase
    }
}

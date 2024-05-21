#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum DwataError {
    // Database related
    DatabaseNotFound,
    CouldNotConnectToDatabase,
    CouldNotQueryDatabase,
    CouldNotCreateDatabase,

    // Workspace related
    ModuleNotFound,

    // AI API related
    InvalidAiProvider,
    CouldNotConnectToAiProvider,
    CouldNotGenerateEmbedding,

    // Internal SQLite DB for Dwata
    CouldNotCreateDwataDB,
    CouldNotConnectToDwataDB,
    CouldNotInsertToDwataDB,
    CouldNotUpdateDwataDB,
    CouldNotFetchRowsFromDwataDB,

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

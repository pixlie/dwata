#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum DwataError {
    // Database type data source related
    DatabaseNotFound,
    CouldNotConnectToDatabase,
    CouldNotQueryDatabase,

    // Config related
    CouldNotLockConfig,
    CouldNotWriteConfig,

    // AI API related
    InvalidAiProvider,
    CouldNotConnectToAiProvider,

    // Internal SQLite DB related
    CouldNotCreateAppDatabase,
    CouldNotConnectToAppDatabase,
    CouldNotInsertToAppDatabase,
}

impl From<sqlx::Error> for DwataError {
    fn from(err: sqlx::Error) -> Self {
        println!("{:?}", err);
        DwataError::CouldNotQueryDatabase
    }
}

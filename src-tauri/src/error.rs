use log::error;
use serde::{Deserialize, Serialize};
use std::error::Error;

#[derive(Debug, Deserialize, Serialize)]
pub enum DwataError {
    // External Database sources
    DatabaseNotFound,
    CouldNotConnectToDatabase,
    CouldNotQueryDatabase,
    CouldNotCreateDatabase,
    InvalidDatabaseType,
    FilterNotSupported,

    // Internal RocksDB for Dwata
    CouldNotCreateDwataDB,
    CouldNotConnectToDwataDB,
    CouldNotInsertToDwataDB,
    CouldNotUpdateDwataDB,
    CouldNotFetchRowsFromDwataDB,
    CouldNotFetchSingleRowFromDwataDB,

    // Blanket error for sqlx
    SqlxError,

    // Workspace and configuration
    ModuleNotFound,
    NextStepNotAvailable,
    CouldNotReadAppUpdates,
    ModuleNotWritable,

    // AI providers/models/features
    InvalidAIModel,
    CouldNotConnectToAIProvider,
    CouldNotGenerateEmbedding,
    FeatureNotAvailableWithAIProvider,
    InvalidProcessStatus,

    // Chat and its processing related
    ChatHasNoMessage,
    NoRequestedAIModel,
    BeingProcessedByAI,
    AlreadyProcessedByAI,
    ChatHasNoRootId,
    ToolUseNotSupported,

    // Integrated vector DB
    CouldNotConnectToVectorDB,

    // Chat context related
    CouldNotFindNode,

    // Directory related
    CouldNotOpenDirectory,

    // Task and app state related
    InvalidTaskStatus,
    TaskHasRunRecently,
    AppStateNotFound,

    // API requests related
    CouldNotConnectToAPI,

    // Enum related
    CouldNotParseEnum,

    // External authentication related
    CouldNotFindOAuth2Config,
    CouldNotCreateAuthURL,
    CouldNotCreateTokenURL,
    CouldNotStartAuthResponseServer,
    CouldNotGetTokenResponse,
    CouldNotAuthenticateToService,

    // Email related
    InvalidEmailProvider,
    InvalidEmailAddress,
    InvalidMailbox,
    CouldNotReadMailBody,
    CouldNotCreateLocalEmailStorage,
    CouldNotOpenLocalEmailStorage,
    CouldNotParseEmailFile,
    CouldNotSelectMailbox,
    CouldNotListMailboxes,
    CouldNotFetchEmails,

    // Search related
    CouldNotCreateSearchIndex,
    SearchIndexDoesNotExist,
    CouldNotOpenSearchIndex,
    CouldNotParseSearchQuery,
    CouldNotSearchTheIndex,
}

impl Error for DwataError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        None
    }
}

impl std::fmt::Display for DwataError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl From<reqwest::Error> for DwataError {
    fn from(err: reqwest::Error) -> Self {
        error!("Could not connect to API\n Error: {}", err);
        DwataError::CouldNotConnectToAPI
    }
}

impl From<strum::ParseError> for DwataError {
    fn from(err: strum::ParseError) -> Self {
        error!("Could not parse enum\n Error: {}", err);
        DwataError::CouldNotParseEnum
    }
}

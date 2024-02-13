#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub enum DwataError {
    DatabaseNotFound,
    CouldNotConnectToDatabase,
}

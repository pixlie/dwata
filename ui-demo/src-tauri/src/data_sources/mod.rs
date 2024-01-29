pub mod commands;

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct DataSource {
    id: i64,
    label: String,
}
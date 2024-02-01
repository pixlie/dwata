pub mod commands;

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct Label {
    id: i64,
    label: String,
    path: String,
}

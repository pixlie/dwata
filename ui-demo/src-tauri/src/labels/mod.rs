use serde::{Deserialize, Serialize};

pub mod commands;

#[derive(Debug, Deserialize, Serialize)]
pub struct Label {
    id: i64,
    label: String,
    path: String,
}

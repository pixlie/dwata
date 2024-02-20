use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Label {
    id: i64,
    label: String,
    path: String,
}

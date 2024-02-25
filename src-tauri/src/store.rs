use crate::workspace::Config;
// use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;

// #[derive(Deserialize, Serialize)]
pub struct Store {
    pub config: Arc<Mutex<Config>>,
}

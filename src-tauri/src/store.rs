use crate::workspace::Config;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Deserialize, Serialize)]
pub struct Store {
    pub config: Mutex<Config>,
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct UserAccount {
    id: u32,
    first_name: String,
    last_name: Option<String>,
    email: Option<String>,
    is_default_user: bool,
}

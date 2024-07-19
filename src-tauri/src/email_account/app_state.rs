use super::EmailAccountIMAPStatus;
use std::sync::Arc;
use tokio::sync::Mutex;

pub type EmailAccountsState = Arc<Mutex<Vec<EmailAccountIMAPStatus>>>;

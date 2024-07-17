use super::EmailAccountItemStatus;
use std::sync::Arc;
use tokio::sync::Mutex;

pub type EmailAccountsState = Arc<Mutex<Vec<EmailAccountItemStatus>>>;

use super::{EmailAccount, EmailProvider, Mailbox, MailboxChoice};
use crate::error::DwataError;
use crate::oauth2::OAuth2App;
use crate::workspace::crud::CRUDRead;
use imap::Session;
use log::{error, info};
use native_tls::{TlsConnector, TlsStream};
use sqlx::{Pool, Sqlite};
use std::net::TcpStream;
use std::sync::Arc;
use tokio::sync::Mutex;

pub struct GmailAccount {
    email_address: String,
    access_token: String,
}

impl imap::Authenticator for GmailAccount {
    type Response = String;
    fn process(&self, _: &[u8]) -> Self::Response {
        format!(
            "user={}\x01auth=Bearer {}\x01\x01",
            self.email_address, self.access_token
        )
    }
}

impl EmailAccount {
    pub async fn get_imap_session(
        &mut self,
        db: &Pool<Sqlite>,
    ) -> Result<Arc<Mutex<Session<TlsStream<TcpStream>>>>, DwataError> {
        match self.status.as_ref().unwrap().imap_session.as_ref() {
            Some(session) => Ok(Arc::clone(session)),
            None => {
                let session = match self.provider {
                    EmailProvider::Gmail => {
                        let gmail_account = self.get_gmail_account(db).await?;
                        let domain = "imap.gmail.com";
                        let tls = TlsConnector::builder().build().unwrap();
                        let client = imap::connect((domain, 993), domain, &tls).unwrap();

                        match client.authenticate("XOAUTH2", &gmail_account) {
                            Ok(session) => {
                                info!("Logged into Gmail with Oauth2 credentials");
                                session
                            }
                            Err((error, _unauth_client)) => {
                                error!("Error authenticating with Gmail:\n{}", error);
                                return Err(DwataError::CouldNotAuthenticateToService);
                            }
                        }
                    }
                    EmailProvider::ProtonMail => {
                        let domain = "127.0.0.1";
                        // This is very dangerous and only needed for ProtonMail Bridge, where connection is ending to localhost
                        let tls = TlsConnector::builder()
                            .danger_accept_invalid_certs(true)
                            .build()
                            .unwrap();
                        let client = imap::connect_starttls((domain, 1143), domain, &tls).unwrap();

                        match client.login(&self.email_address, &self.password.as_ref().unwrap()) {
                            Ok(session) => {
                                info!("Logged into Protonmail with username/password");
                                session
                            }
                            Err((error, _unauth_client)) => {
                                error!("Error authenticating with Protonmail:\n{}", error);
                                return Err(DwataError::CouldNotAuthenticateToService);
                            }
                        }
                    }
                };

                let session = Arc::new(Mutex::new(session));
                self.status.as_mut().unwrap().imap_session = Some(session.clone());
                Ok(session.clone())
            }
        }
    }

    pub async fn get_gmail_account(&self, db: &Pool<Sqlite>) -> Result<GmailAccount, DwataError> {
        if let Some(oauth2_config_id) = self.oauth2_token_id {
            let oauth2: OAuth2App = OAuth2App::read_one_by_pk(oauth2_config_id, db).await?;
            let gmail_account = GmailAccount {
                email_address: self.email_address.clone(),
                access_token: oauth2.access_token,
            };
            Ok(gmail_account)
        } else {
            Err(DwataError::CouldNotFindOAuth2Config)
        }
    }

    pub async fn get_selected_mailbox(&self, db: &Pool<Sqlite>) -> Result<Mailbox, DwataError> {
        let choice = &self.status.as_ref().unwrap().selected_mailbox_choice;
        let name = match self.provider {
            EmailProvider::Gmail => match choice {
                MailboxChoice::Inbox => "INBOX".to_string(),
                MailboxChoice::Sent => "[Gmail]/Sent Mail".to_string(),
            },
            EmailProvider::ProtonMail => match choice {
                MailboxChoice::Inbox => "INBOX".to_string(),
                MailboxChoice::Sent => "Sent".to_string(),
            },
        };
        let mailboxes_in_db = Mailbox::read_all(db).await?;
        mailboxes_in_db
            .into_iter()
            .find(|mb| mb.email_account_id == self.id && mb.name == name)
            .ok_or(DwataError::CouldNotSelectMailbox)
    }
}

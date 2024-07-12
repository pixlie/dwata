use crate::{error::DwataError, oauth2::OAuth2, workspace::crud::CRUDRead};
use chrono::{DateTime, FixedOffset, Utc};
use imap::{self, Session};
use log::{error, info};
use mail_parser::MessageParser;
use native_tls::TlsStream;
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, SqliteConnection, Type};
use std::net::TcpStream;
use strum::{Display, EnumString};
use ts_rs::TS;

pub mod api;
pub mod commands;
pub mod crud;

#[derive(Deserialize, Serialize, Type, TS, EnumString, Display)]
#[sqlx(rename_all = "lowercase")]
#[serde(rename_all = "lowercase")]
#[strum(serialize_all = "lowercase")]
#[ts(export)]
pub enum EmailProvider {
    Gmail,
    ProtonMail,
    // Yahoo,
    // Outlook,
}

#[derive(Serialize, FromRow, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailAccount {
    #[ts(type = "number")]
    pub id: i64,

    pub provider: EmailProvider,

    pub email_address: String,
    pub password: Option<String>,
    pub oauth2_id: Option<i64>,

    pub created_at: DateTime<Utc>,
    pub modified_at: Option<DateTime<Utc>>,
}

#[derive(Default, Deserialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct EmailAccountCreateUpdate {
    pub provider: Option<String>,
    pub email_address: Option<String>,
    pub password: Option<String>,
    pub oauth2_id: Option<String>,
}

#[derive(Serialize, TS)]
#[serde(rename_all = "camelCase")]
#[ts(export, rename_all = "camelCase")]
pub struct Email {
    pub from: (String, String),
    pub date: DateTime<FixedOffset>,
    pub subject: String,
    pub body_text: String,
}

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
    pub async fn read_inbox(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<Vec<Email>, DwataError> {
        let mut imap_session = self.get_imap_session(db_connection).await?;
        match imap_session.examine("INBOX") {
            Ok(mailbox) => info!("{}", mailbox),
            Err(e) => error!("Error selecting INBOX: {}", e),
        };

        let mut emails: Vec<Email> = vec![];
        match imap_session.fetch("1", "BODY.PEEK[]") {
            Ok(messages) => {
                for message in messages.iter() {
                    match message.body() {
                        Some(body) => match MessageParser::default().parse(body) {
                            Some(parsed) => {
                                let from = match parsed.from() {
                                    Some(from) => match from.first() {
                                        Some(first) => (
                                            first.name().unwrap().to_string(),
                                            first.address().unwrap().to_string(),
                                        ),
                                        None => continue,
                                    },
                                    None => continue,
                                };
                                let date = match parsed.date() {
                                    Some(dt) => {
                                        match DateTime::parse_from_rfc3339(&dt.to_rfc3339()) {
                                            Ok(dt) => dt,
                                            Err(_) => continue,
                                        }
                                    }
                                    None => {
                                        continue;
                                    }
                                };
                                let subject = match parsed.subject() {
                                    Some(subject) => subject.to_string(),
                                    None => continue,
                                };
                                let body_text = match parsed.body_text(0) {
                                    Some(body_text) => body_text.to_string(),
                                    None => continue,
                                };
                                emails.push(Email {
                                    from,
                                    date,
                                    subject,
                                    body_text,
                                });
                            }
                            None => continue,
                        },
                        None => continue,
                    }
                }
            }
            Err(e) => error!("Error Fetching email 1: {}", e),
        };

        imap_session.logout().unwrap();
        Ok(emails)
    }
}

impl EmailAccount {
    pub async fn get_imap_session(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<Session<TlsStream<TcpStream>>, DwataError> {
        match self.provider {
            EmailProvider::Gmail => {
                let gmail_account = self.get_gmail_account(db_connection).await?;
                let domain = "imap.gmail.com";
                let tls = native_tls::TlsConnector::builder().build().unwrap();
                let client = imap::connect((domain, 993), domain, &tls).unwrap();

                match client.authenticate("XOAUTH2", &gmail_account) {
                    Ok(session) => {
                        info!("Logged into Gmail with Oauth2 credentials");
                        Ok(session)
                    }
                    Err((error, _unauth_client)) => {
                        error!("Error authenticating with Gmail:\n{}", error);
                        return Err(DwataError::CouldNotAuthenticateToService);
                    }
                }
            }
            EmailProvider::ProtonMail => {
                let domain = "localhost";
                let tls = native_tls::TlsConnector::builder().build().unwrap();
                let client = imap::connect_starttls((domain, 1143), domain, &tls).unwrap();

                match client.login(&self.email_address, &self.password.as_ref().unwrap()) {
                    Ok(session) => {
                        info!("Logged into Protonmail with Oauth2 credentials");
                        Ok(session)
                    }
                    Err((error, _unauth_client)) => {
                        error!("Error authenticating with Protonmail:\n{}", error);
                        return Err(DwataError::CouldNotAuthenticateToService);
                    }
                }
            }
        }
    }
}

impl EmailAccount {
    pub async fn get_gmail_account(
        &self,
        db_connection: &mut SqliteConnection,
    ) -> Result<GmailAccount, DwataError> {
        if let Some(oauth2_config_id) = self.oauth2_id {
            let oauth2_config: OAuth2 =
                OAuth2::read_one_by_pk(oauth2_config_id, db_connection).await?;
            let gmail_account = GmailAccount {
                email_address: self.email_address.clone(),
                access_token: oauth2_config.access_token,
            };
            Ok(gmail_account)
        } else {
            Err(DwataError::CouldNotFindOAuth2Config)
        }
    }
}

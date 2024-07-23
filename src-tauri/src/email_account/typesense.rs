use super::helpers::read_emails_from_local_storage;
use super::EmailAccount;
use crate::email::{Email, SearchableEmail};
use crate::error::DwataError;
use crate::workspace::typesense::{TypesenseCollection, TypesenseSearchable};
use log::info;
use slug::slugify;
use sqlx::{Pool, Sqlite};

impl TypesenseSearchable for EmailAccount {
    async fn get_collection_name(&self, db: &Pool<Sqlite>) -> Result<String, DwataError> {
        Ok(format!(
            "dwata_emails_{}_{}",
            self.id,
            slugify(self.get_selected_mailbox(db).await?.storage_path)
        ))
    }

    async fn get_collection_schema(
        &self,
        db: &Pool<Sqlite>,
    ) -> Result<TypesenseCollection, DwataError> {
        Ok(TypesenseCollection {
            name: self.get_collection_name(db).await?,
            fields: Email::get_typesense_fields(),
            default_sorting_field: Some("date".to_string()),
        })
    }

    async fn get_json_lines(&self, db: &Pool<Sqlite>) -> Result<Vec<String>, DwataError> {
        let emails = read_emails_from_local_storage(self.get_storage_dir(db).await?, 1000).await?;

        info!("Emails to index in Typesense: {}", emails.len());
        Ok(emails
            .iter()
            .map(|x| {
                serde_json::to_string(&SearchableEmail {
                    id: x.id.to_string(),
                    from_name: x.from_name.clone(),
                    from_email: x.from_email.clone(),
                    date: x.date,
                    subject: x.subject.clone(),
                    body_text: x.body_text.clone(),
                })
                .unwrap()
            })
            .collect::<Vec<String>>())
    }
}

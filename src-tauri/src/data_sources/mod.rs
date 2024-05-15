pub mod api_types;
pub mod database;
pub mod helpers;

pub use database::{Database, DatabasePool, DatabaseSource};

pub(crate) trait Datasource {
    fn get_id(&self) -> String;

    fn get_name(&self) -> String;

    fn get_label(&self) -> String;
}

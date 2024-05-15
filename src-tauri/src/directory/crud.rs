use crate::relational_database::crud::CRUD;

use super::Directory;

impl CRUD for Directory {
    type Model = Directory;
    type PrimaryKey = i64;

    async fn read_list() -> Result<Vec<Self::Model>, crate::error::DwataError> {}
}

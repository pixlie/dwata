use crate::error::DwataError;
use log::{error, info};
use rocksdb::{DBWithThreadMode, Options, SingleThreaded, SliceTransform, DB};
use std::fs::create_dir_all;
use std::path::PathBuf;

pub struct DwataDB {
    root_path: PathBuf,
}

impl DwataDB {
    pub fn new(root_path: &PathBuf) -> Self {
        let mut db_path = PathBuf::from(root_path);
        db_path.push("dwatadb");
        if !db_path.as_path().exists() {
            create_dir_all(db_path.as_path()).unwrap_or_else(|_| {});
            info!("Created Dwata DB directory: {}", db_path.to_str().unwrap());
        }
        Self {
            root_path: root_path.clone(),
        }
    }

    pub fn get_db(
        &self,
        table_name: &str,
        prefix_opt: Option<String>,
    ) -> Result<DBWithThreadMode<SingleThreaded>, DwataError> {
        let mut db_path = self.root_path.clone();
        db_path.push(table_name);
        let db_options = match prefix_opt {
            Some(prefix) => {
                let mut db_options = Options::default();
                db_options
                    .set_prefix_extractor(SliceTransform::create_fixed_prefix(prefix.len() + 1));
                db_options
            }
            None => Options::default(),
        };
        match DB::open(&db_options, db_path) {
            Ok(db) => Ok(db),
            Err(err) => {
                error!("Could not open Dwata DB\n Error: {}", err);
                Err(DwataError::CouldNotConnectToDwataDB)
            }
        }
    }
}

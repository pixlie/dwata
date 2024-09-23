use crate::error::DwataError;
use log::{error, info};
use rocksdb::{DBWithThreadMode, Options, SingleThreaded, SliceTransform, TransactionDB, DB};
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

    pub fn increment_key(&self, table_name: &str) -> Result<u32, DwataError> {
        // We store all incrementing keys in a separate table
        // We check if the queried table has a key in our incrementing table
        let mut db_path = self.root_path.clone();
        db_path.push(table_name);
        db_path.push("_incrementing_keys");
        let key = format!("key/{}", table_name);
        let db: TransactionDB = match TransactionDB::open_default(db_path) {
            Ok(db) => db,
            Err(err) => {
                error!("Could not open Dwata DB\n Error: {}", err);
                return Err(DwataError::CouldNotConnectToDwataDB);
            }
        };
        match db.get(key.clone()) {
            Ok(Some(value)) => {
                // We have existing key, let's increment it
                let value: [u8; 4] = match value.try_into() {
                    Ok(x) => x,
                    Err(_) => {
                        error!("Could not convert key to u32");
                        return Err(DwataError::CouldNotConnectToDwataDB);
                    }
                };
                let u32value: u32 = u32::from_ne_bytes(value) + 1;
                db.put(key, u32value.to_ne_bytes());
                Ok(u32value)
            }
            Ok(None) => {
                // We did not find a key, let's create one
                db.put(key, 1_u32.to_ne_bytes());
                Ok(1_u32)
            }
            Err(err) => {
                error!("Could not open Dwata DB\n Error: {}", err);
                Err(DwataError::CouldNotConnectToDwataDB)
            }
        }
    }
}

use std::{fs::File, path::Path};

use anyhow::Result;

use crate::kv::LocalKeyValueStorage;

pub struct LocalPersistentKeyValueStorage {
    kv: LocalKeyValueStorage,
}

impl LocalPersistentKeyValueStorage {
    pub fn new(path: impl AsRef<Path>) -> Result<Self> {
        let file = if !path.as_ref().exists() {
            File::create(path.as_ref())?
        } else {
            File::open(path.as_ref())?
        };

        let backend = redb::backends::FileBackend::new(file)?;

        let kv = LocalKeyValueStorage::new(backend)?;
        Ok(Self { kv })
    }

    pub fn get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>> {
        self.kv.get(table, key)
    }
}

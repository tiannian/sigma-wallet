use std::{fs::File, path::Path};

use anyhow::Result;
use async_trait::async_trait;
use sigwa_core::{KeyValueStorage, PersistentKeyValueStorage};

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

    pub fn set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()> {
        self.kv.set(table, key, value)
    }

    pub fn remove(&self, table: &str, key: &[u8]) -> Result<()> {
        self.kv.remove(table, key)
    }
}

#[async_trait]
impl KeyValueStorage for LocalPersistentKeyValueStorage {
    async fn set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()> {
        self.kv.set(table, key, value)
    }

    async fn get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>> {
        self.kv.get(table, key)
    }

    async fn remove(&self, table: &str, key: &[u8]) -> Result<()> {
        self.kv.remove(table, key)
    }
}

impl PersistentKeyValueStorage for LocalPersistentKeyValueStorage {}

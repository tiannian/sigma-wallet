use anyhow::Result;
use async_trait::async_trait;
use sigwa_core::{KeyValueStorage, SessionKeyValueStorage};

use crate::kv::LocalKeyValueStorage;

pub struct LocalSessionKeyValueStorage {
    kv: LocalKeyValueStorage,
}

impl LocalSessionKeyValueStorage {
    pub fn new() -> Result<Self> {
        let backend = redb::backends::InMemoryBackend::new();

        let kv = LocalKeyValueStorage::new(backend)?;

        Ok(Self { kv })
    }
}

#[async_trait]
impl KeyValueStorage for LocalSessionKeyValueStorage {
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

impl SessionKeyValueStorage for LocalSessionKeyValueStorage {}


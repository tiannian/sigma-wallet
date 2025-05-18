use std::path::{Path, PathBuf};

use anyhow::Result;
use async_trait::async_trait;
use sigwa_core::{KeyValueStorage, PersistentKeyValueStorage};
use tokio::fs;

pub struct JsonFileKeyValueStorage {
    path: PathBuf,
}

impl JsonFileKeyValueStorage {
    pub fn new(path: impl AsRef<Path>) -> Self {
        Self {
            path: path.as_ref().to_path_buf(),
        }
    }

    async fn _set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()> {
        let path = self.path.join(table);

        fs::create_dir_all(&path).await?;

        let key = String::from_utf8(key.to_vec())?;

        fs::write(path.join(format!("{}.json", key)), value).await?;
        Ok(())
    }

    async fn _get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>> {
        let key = String::from_utf8(key.to_vec())?;
        let path = self.path.join(table).join(format!("{}.json", key));

        if !path.exists() {
            Ok(None)
        } else {
            let value = fs::read(path).await?;
            Ok(Some(value))
        }
    }

    async fn _remove(&self, table: &str, key: &[u8]) -> Result<()> {
        let key = String::from_utf8(key.to_vec())?;
        let path = self.path.join(table).join(format!("{}.json", key));

        fs::remove_file(path).await?;
        Ok(())
    }
}

#[async_trait]
impl KeyValueStorage for JsonFileKeyValueStorage {
    async fn set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()> {
        self._set(table, key, value).await
    }

    async fn get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>> {
        self._get(table, key).await
    }

    async fn remove(&self, table: &str, key: &[u8]) -> Result<()> {
        self._remove(table, key).await
    }
}

impl PersistentKeyValueStorage for JsonFileKeyValueStorage {}

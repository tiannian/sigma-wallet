use alloy_primitives::Bytes;
use anyhow::Result;
use async_trait::async_trait;

mod sql;
pub use sql::*;

pub trait Cryptor {
    fn encrypt(&self, data: &[u8]) -> Result<Bytes>;

    fn decrypt(&self, data: &[u8]) -> Result<Bytes>;
}

#[async_trait]
pub trait KeyValueStorage {
    async fn set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()>;

    async fn get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>>;

    async fn remove(&self, table: &str, key: &[u8]) -> Result<()>;
}

pub trait SessionKeyValueStorage {}

pub trait PersistentKeyValueStorage {}

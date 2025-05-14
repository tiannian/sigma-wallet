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
    async fn set(&self, key: &str, value: &str) -> Result<()>;

    async fn get(&self, key: &str) -> Result<Option<String>>;

    async fn has(&self, key: &str) -> Result<bool>;

    async fn remove(&self, key: &str) -> Result<()>;
}

pub trait SessionKeyValueStorage {}

pub trait PersistentKeyValueStorage {}

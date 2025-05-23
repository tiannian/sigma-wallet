use alloy_primitives::B256;
use anyhow::Result;
use async_trait::async_trait;

use crate::GuardType;

mod account;
pub use account::*;

pub trait Guard {
    fn encrypt(&self, data: B256) -> Result<Vec<u8>>;

    fn decrypt(&self, data: &[u8]) -> Result<B256>;

    fn guard_type(&self) -> GuardType;
}

#[async_trait]
pub trait KeyValueStorage {
    async fn set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()>;

    async fn get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>>;

    async fn remove(&self, table: &str, key: &[u8]) -> Result<()>;
}

pub trait SessionKeyValueStorage {}

pub trait PersistentKeyValueStorage {}

pub trait SubAccount {
    fn wid(&self, device_id: &str) -> Result<String>;

    fn name(&self) -> String;
}

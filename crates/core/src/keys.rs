use alloy_primitives::{B256, Bytes};
use anyhow::Result;
use rand_core::{CryptoRng, RngCore};
use serde::{Deserialize, Serialize};

use crate::Cryptor;

#[derive(Debug, Serialize, Deserialize)]
pub struct EncryptedKey {
    pub encrypted_key: Bytes,
    #[serde(skip)]
    pub unencrypted_key: Option<B256>,
}

impl EncryptedKey {
    pub fn create<R, C>(rng: &mut R, key: &C) -> Result<Self>
    where
        R: RngCore + CryptoRng,
        C: Cryptor,
    {
        let mut unencrypted_key = B256::default();
        rng.fill_bytes(unencrypted_key.as_mut_slice());

        let encrypted_key = key.encrypt(unencrypted_key.as_ref())?;

        Ok(Self {
            encrypted_key,
            unencrypted_key: Some(unencrypted_key),
        })
    }

    pub fn decrypt<C>(&mut self, key: &C) -> Result<()>
    where
        C: Cryptor,
    {
        let unencrypted_key = key.decrypt(&self.encrypted_key)?;
        self.unencrypted_key = Some(B256::from_slice(unencrypted_key.as_ref()));
        Ok(())
    }

    pub fn reset(&mut self) {
        self.unencrypted_key = None;
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct KeyStore {
    pub auth_key: EncryptedKey,
    pub transaction_key: EncryptedKey,
}

impl KeyStore {
    pub fn create<R, C>(rng: &mut R, key: &C) -> Result<Self>
    where
        R: RngCore + CryptoRng,
        C: Cryptor,
    {
        Ok(Self {
            auth_key: EncryptedKey::create(rng, key)?,
            transaction_key: EncryptedKey::create(rng, key)?,
        })
    }
}

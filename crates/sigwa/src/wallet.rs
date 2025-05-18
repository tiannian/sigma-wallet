use std::collections::BTreeMap;

use alloy_primitives::{B256, Bytes};
use anyhow::Result;
use rand_core::{CryptoRng, RngCore};
use serde::{Deserialize, Serialize};
use sigwa_core::{EncryptedData, Guard, GuardType, KeyValueStorage, PersistentKeyValueStorage};

use crate::utils;

#[derive(Debug, Serialize, Deserialize, Default, Clone)]
struct EncryptedWallet {
    pub(crate) auth_key: BTreeMap<GuardType, Bytes>,
    pub(crate) transaction_key: BTreeMap<GuardType, Bytes>,
}

pub struct Wallet {
    encrypted_wallet: Option<EncryptedWallet>,
    unencrypted_auth_key: Option<B256>,
}

impl Wallet {
    pub async fn new<S>(storage: &S) -> Result<Self>
    where
        S: PersistentKeyValueStorage + KeyValueStorage,
    {
        let encrypted_wallet = storage.get("", b"wallet").await?;

        let encrypted_wallet = if let Some(encrypted_wallet) = encrypted_wallet {
            Some(serde_json::from_slice(&encrypted_wallet)?)
        } else {
            None
        };

        Ok(Self {
            encrypted_wallet,
            unencrypted_auth_key: None,
        })
    }

    /// Create a new wallet with a new guard
    ///
    /// Note: If wallet is initialized, it will be replaced with a new wallet
    pub fn create_keys<R, G>(&mut self, rng: &mut R, guard: &G) -> Result<()>
    where
        R: RngCore + CryptoRng,
        G: Guard,
    {
        let mut encrypted_wallet = EncryptedWallet::default();

        // Add auth key
        let mut auth_key = B256::default();
        rng.fill_bytes(auth_key.as_mut());

        let encrypted_auth_key = guard.encrypt(auth_key)?;
        encrypted_wallet
            .auth_key
            .insert(guard.guard_type(), encrypted_auth_key.into());

        // Add transaction key
        let mut transaction_key = B256::default();
        rng.fill_bytes(transaction_key.as_mut());
        let encrypted_transaction_key = guard.encrypt(transaction_key)?;
        encrypted_wallet
            .transaction_key
            .insert(guard.guard_type(), encrypted_transaction_key.into());

        // Save encrypted wallet
        self.encrypted_wallet = Some(encrypted_wallet);

        Ok(())
    }

    /// Add a new guard to the wallet
    ///
    /// If you want to add a new guard, you must first add the old guard to the wallet
    /// If old guard and new guard are the same, it will be replaced with a new wallet.
    /// For example, this function can use to modify the password
    pub fn add_guard(&mut self, old_guard: &impl Guard, new_guard: &impl Guard) -> Result<()> {
        let encrypted_wallet = self
            .encrypted_wallet
            .as_mut()
            .ok_or(anyhow::anyhow!("Wallet not initialized"))?;

        let guard_type = new_guard.guard_type();

        // Add guard for auth key
        let unencrypted_auth_key = old_guard.decrypt(
            encrypted_wallet
                .auth_key
                .get(&old_guard.guard_type())
                .ok_or(anyhow::anyhow!("Old guard not found"))?,
        )?;

        let encrypted_auth_key = new_guard.encrypt(unencrypted_auth_key)?;
        if let Some(encrypted_auth_key) = encrypted_wallet.auth_key.get_mut(&guard_type) {
            *encrypted_auth_key = encrypted_auth_key.clone();
        } else {
            encrypted_wallet
                .auth_key
                .insert(guard_type, encrypted_auth_key.into());
        }

        // Add guard for transaction key
        let unencrypted_transaction_key = old_guard.decrypt(
            encrypted_wallet
                .transaction_key
                .get(&old_guard.guard_type())
                .ok_or(anyhow::anyhow!("Old guard not found"))?,
        )?;
        let encrypted_transaction_key = new_guard.encrypt(unencrypted_transaction_key)?;
        if let Some(encrypted_transaction_key) =
            encrypted_wallet.transaction_key.get_mut(&guard_type)
        {
            *encrypted_transaction_key = encrypted_transaction_key.clone();
        } else {
            encrypted_wallet
                .transaction_key
                .insert(guard_type, encrypted_transaction_key.into());
        }

        Ok(())
    }

    pub fn unlock(&mut self, guard: &impl Guard) -> Result<()> {
        let encrypted_wallet = self
            .encrypted_wallet
            .as_ref()
            .ok_or(anyhow::anyhow!("Wallet not initialized"))?;

        let guard_data = encrypted_wallet
            .auth_key
            .get(&guard.guard_type())
            .ok_or(anyhow::anyhow!("Guard not found"))?;

        self.unencrypted_auth_key = Some(guard.decrypt(guard_data)?);

        Ok(())
    }

    pub fn lock(&mut self) -> Result<()> {
        self.unencrypted_auth_key = None;

        Ok(())
    }

    pub fn is_unlocked(&self) -> bool {
        self.unencrypted_auth_key.is_some()
    }

    pub fn is_initialized(&self) -> bool {
        self.encrypted_wallet.is_some()
    }

    pub fn encrypt_auth_data<R>(&self, rng: &mut R, data: &[u8]) -> Result<EncryptedData>
    where
        R: RngCore + CryptoRng,
    {
        let unencrypted_auth_key = self
            .unencrypted_auth_key
            .as_ref()
            .ok_or(anyhow::anyhow!("Wallet not unlocked"))?;

        let mut nonce = [0; 12];
        rng.fill_bytes(nonce.as_mut());

        utils::encrypt_aes256_gcm(*unencrypted_auth_key, nonce, data)
    }

    pub fn decrypt_auth_data(&self, data: EncryptedData) -> Result<Vec<u8>> {
        let unencrypted_auth_key = self
            .unencrypted_auth_key
            .as_ref()
            .ok_or(anyhow::anyhow!("Wallet not unlocked"))?;

        utils::decrypt(*unencrypted_auth_key, data)
    }

    pub fn encrypt_transaction_data<R>(
        &self,
        rng: &mut R,
        data: &[u8],
        guard: &impl Guard,
    ) -> Result<EncryptedData>
    where
        R: RngCore + CryptoRng,
    {
        let encrypted_wallet = self
            .encrypted_wallet
            .as_ref()
            .ok_or(anyhow::anyhow!("Wallet not initialized"))?;

        let guard_data = encrypted_wallet
            .transaction_key
            .get(&guard.guard_type())
            .ok_or(anyhow::anyhow!("Guard not found"))?;

        let unencrypted_transaction_key = guard.decrypt(guard_data)?;

        let mut nonce = [0; 12];
        rng.fill_bytes(nonce.as_mut());

        let encrypted_data = utils::encrypt_aes256_gcm(unencrypted_transaction_key, nonce, data)?;

        Ok(encrypted_data)
    }

    pub fn decrypt_transaction_data(
        &self,
        data: EncryptedData,
        guard: &impl Guard,
    ) -> Result<Vec<u8>> {
        let encrypted_wallet = self
            .encrypted_wallet
            .as_ref()
            .ok_or(anyhow::anyhow!("Wallet not initialized"))?;

        let guard_data = encrypted_wallet
            .transaction_key
            .get(&guard.guard_type())
            .ok_or(anyhow::anyhow!("Guard not found"))?;

        let unencrypted_transaction_key = guard.decrypt(guard_data)?;

        let encrypted_data = utils::decrypt(unencrypted_transaction_key, data)?;

        Ok(encrypted_data)
    }

    pub async fn save(&self, storage: &impl KeyValueStorage) -> Result<()> {
        let encrypted_wallet = serde_json::to_vec(&self.encrypted_wallet)?;
        storage.set("", b"wallet", encrypted_wallet).await?;

        Ok(())
    }
}

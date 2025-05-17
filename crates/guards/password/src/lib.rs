use alloy_primitives::B256;
use anyhow::Result;
use rand_core::{CryptoRng, RngCore};
use sha3::{Digest, Sha3_256};
use sigwa_core::{EncryptedData, Guard, GuardType};
use sigwa_wallet::utils;

pub struct PasswordGuard {
    password: B256,
    salt: B256,
}

impl PasswordGuard {
    pub fn new<R>(rng: &mut R, password: &str) -> Result<Self>
    where
        R: RngCore + CryptoRng,
    {
        let mut hasher = Sha3_256::new();
        hasher.update(password.as_bytes());
        let hash = hasher.finalize();

        let mut salt = B256::default();
        rng.fill_bytes(salt.as_mut());

        Ok(Self {
            password: B256::from_slice(&hash),
            salt,
        })
    }

    fn _encrypt(&self, data: B256) -> Result<Vec<u8>> {
        let mut hasher = Sha3_256::new();

        hasher.update(&self.password.0);
        hasher.update(&self.salt.0);
        let hash = hasher.finalize();

        let nonce = [
            hash[0], hash[1], hash[2], hash[3], hash[4], hash[5], hash[6], hash[7], hash[8],
            hash[9], hash[10], hash[11],
        ];

        let encrypted_data = utils::encrypt_aes256_gcm(self.password, nonce, &data.0)?;

        Ok(encrypted_data.to_vec())
    }

    fn _decrypt(&self, data: &[u8]) -> Result<B256> {
        let encrypted_data = EncryptedData::from_slice(data)?;

        let res = utils::decrypt(self.password, encrypted_data)?;

        Ok(B256::from_slice(&res))
    }
}

impl Guard for PasswordGuard {
    fn encrypt(&self, data: B256) -> Result<Vec<u8>> {
        self._encrypt(data)
    }

    fn decrypt(&self, data: &[u8]) -> Result<B256> {
        self._decrypt(data)
    }

    fn guard_type(&self) -> GuardType {
        GuardType::Password
    }
}

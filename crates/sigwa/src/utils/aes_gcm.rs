use aes_gcm::{Aes256Gcm, Key, KeyInit, Nonce, aead::Aead};
use alloy_primitives::B256;
use anyhow::Result;
use sigwa_core::EncryptedData;

pub fn encrypt_aes256_gcm(key: B256, nonce: [u8; 12], data: &[u8]) -> Result<EncryptedData> {
    let key: Key<Aes256Gcm> = key.0.into();

    let cipher = Aes256Gcm::new(&key);

    let nonce = Nonce::from(nonce);

    let data = cipher
        .encrypt(&nonce, data)
        .map_err(|e| anyhow::anyhow!(e))?;

    let nonce: [u8; 12] = nonce.into();

    Ok(EncryptedData::Aes256Gcm { nonce, data })
}

pub fn decrypt(key: B256, encrypted_data: EncryptedData) -> Result<Vec<u8>> {
    let key: Key<Aes256Gcm> = key.0.into();
    let cipher = Aes256Gcm::new(&key);

    if let EncryptedData::Aes256Gcm { nonce, data } = encrypted_data {
        let nonce = Nonce::from(nonce);
        let plaintext = cipher
            .decrypt(&nonce, data.as_ref())
            .map_err(|e| anyhow::anyhow!(e))?;

        Ok(plaintext)
    } else {
        Err(anyhow::anyhow!("Invalid encrypted data"))
    }
}

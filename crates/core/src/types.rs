use alloy_primitives::Bytes;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum EncryptedData {
    Aes256Gcm { data: Bytes, nonce: [u8; 12] },
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash, Clone, Copy, Ord, PartialOrd)]
pub enum GuardType {
    Password,
    WindowsHello,
}

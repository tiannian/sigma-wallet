use alloy_primitives::{Bytes, FixedBytes};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum EncryptedData {
    Unknown,
    Aes256Gcm { data: Bytes, nonce: FixedBytes<12> },
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash, Clone, Copy, Ord, PartialOrd)]
pub enum GuardType {
    Password,
    WindowsHello,
}

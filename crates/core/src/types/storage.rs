use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum EncryptedData {
    Unknown,
    Aes256Gcm { data: Vec<u8>, nonce: [u8; 12] },
}

impl EncryptedData {
    pub fn to_vec(&self) -> Vec<u8> {
        match self {
            EncryptedData::Unknown => vec![0],
            EncryptedData::Aes256Gcm { data, nonce } => {
                let mut res = vec![1];
                res.extend_from_slice(nonce.as_ref());
                res.extend_from_slice(data);
                res
            }
        }
    }

    pub fn from_slice(data: &[u8]) -> Result<Self> {
        if data.len() < 13 {
            return Err(anyhow::anyhow!("Invalid encrypted data"));
        }

        let data_type = data[0];

        match data_type {
            0 => Ok(EncryptedData::Unknown),
            1 => {
                let nonce: [u8; 12] = data[1..13]
                    .try_into()
                    .map_err(|_| anyhow::anyhow!("Invalid encrypted data"))?;
                let data = data[13..].to_vec();
                Ok(EncryptedData::Aes256Gcm { data, nonce })
            }
            _ => Err(anyhow::anyhow!("Invalid encrypted data")),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Hash, Clone, Copy, Ord, PartialOrd)]
#[serde(rename_all = "kebab-case")]
pub enum GuardType {
    Password,
    WindowsHello,
}

#[derive(Debug)]
pub enum MigrationType {
    Simple,
    Up,
    Down,
}

#[derive(Debug)]
pub struct Migration {
    pub version: i64,
    pub description: &'static str,
    pub migration_type: MigrationType,
    pub sql: &'static str,
}

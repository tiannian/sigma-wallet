use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum NetworkType {
    Eip155,
    Solana,
    Bitcoin,
}

impl NetworkType {
    pub fn from_u32(value: u32) -> Result<Self> {
        match value {
            0 => Ok(NetworkType::Eip155),
            1 => Ok(NetworkType::Solana),
            2 => Ok(NetworkType::Bitcoin),
            _ => Err(anyhow::anyhow!("invalid network type {}", value)),
        }
    }
}

impl From<NetworkType> for i64 {
    fn from(value: NetworkType) -> Self {
        match value {
            NetworkType::Eip155 => 0,
            NetworkType::Solana => 1,
            NetworkType::Bitcoin => 2,
        }
    }
}

pub struct NetworkId {
    pub network_type: NetworkType,
    pub chain_id: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkInfo {
    pub name: String,
    pub network_type: NetworkType,
    pub chain_id: String,
    pub symbol: String,
    pub native_asset: Option<String>,
    pub decimals: u8,
    pub rpc_urls: Vec<String>,
    pub selected_rpc_url: usize,
    pub explorers: Vec<Explorer>,
    pub selected_explorer: usize,
    pub slip44: u64,
    pub icon: Option<String>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ExplorerType {
    Eip3091,
}

impl ExplorerType {
    pub fn from_u32(value: u32) -> Result<Self> {
        match value {
            0 => Ok(ExplorerType::Eip3091),
            _ => Err(anyhow::anyhow!("invalid explorer type {}", value)),
        }
    }
}

impl From<ExplorerType> for i64 {
    fn from(value: ExplorerType) -> Self {
        match value {
            ExplorerType::Eip3091 => 0,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Explorer {
    pub name: String,
    pub url: String,
    pub explorer_type: ExplorerType,
}

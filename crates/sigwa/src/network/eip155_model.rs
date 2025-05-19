use serde::{Deserialize, Serialize};

use super::NetworkInfo;

#[derive(Debug, Serialize, Deserialize)]
pub struct Eip155Rpc {
    pub url: String,
    pub tracking: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Eip155Currency {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Eip155Explorer {
    pub name: String,
    pub url: String,
    pub standard: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Eip155ChainInfo {
    pub name: String,
    pub icon: Option<String>,
    pub rpc: Vec<Eip155Rpc>,
    #[serde(rename = "nativeCurrency")]
    pub native_currency: Eip155Currency,
    #[serde(rename = "chainId")]
    pub chain_id: u64,
    #[serde(default)]
    pub explorers: Vec<Eip155Explorer>,
    #[serde(default)]
    pub slip44: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Eip155 {
    pub list: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Chainlist {
    pub eip155: Eip155,
    pub chains: Vec<NetworkInfo>,
}

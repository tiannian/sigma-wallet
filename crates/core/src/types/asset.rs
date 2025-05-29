use std::collections::BTreeMap;

use alloy_primitives::Address;

use super::NetworkId;

pub enum AssetAddress {
    Eip155(Address),
    Native,
}

pub enum AssetType {
    Crypto,
    Fiat,
}

pub struct Asset {
    pub symbol: String,
    pub name: String,
    pub ty_: AssetType,
    pub decimals: u8,
    pub crypto_address: BTreeMap<NetworkId, AssetAddress>,
}

pub struct AssetId(pub u32);

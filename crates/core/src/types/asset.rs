use std::collections::BTreeMap;

use alloy_primitives::Address;

use super::NetworkId;

pub enum CryptoAddress {
    Eip155(Address),
}

pub enum AssetType {
    CryptoNative,
    CryptoERC20,
    Fiat,
}

pub struct Asset {
    pub symbol: String,
    pub name: String,
    pub ty_: AssetType,
    pub decimals: u8,
    pub crypto_address: BTreeMap<NetworkId, CryptoAddress>,
}

pub struct AssetId(pub u32);

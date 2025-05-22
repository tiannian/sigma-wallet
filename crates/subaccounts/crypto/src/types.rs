use std::collections::BTreeMap;

use alloy_primitives::{Address, B256, U256};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Eip155Account {
    pub address: Address,
    pub nonce: u64,
    pub balance: BTreeMap<Address, U256>,
    pub name: String,
}

#[derive(Serialize, Deserialize)]
pub struct BitcoinAccount {
    pub name: String,
    pub balance: U256,
}

#[derive(Serialize, Deserialize)]
pub struct SolanaAccount {
    pub name: String,
    pub balance: U256,
}

#[derive(Default, Serialize, Deserialize)]
pub struct SubAccount {
    pub eip155_account: Vec<Eip155Account>,
    pub bitcoin_account: Vec<BitcoinAccount>,
    pub solana_account: Vec<SolanaAccount>,
    pub private_key_type: PrivateKeyType,
}

#[derive(Default, Serialize, Deserialize)]
pub enum PrivateKeyType {
    #[default]
    Entropy,
    PrivateKey,
}

#[derive(Serialize, Deserialize)]
pub enum PrivateKey {
    Entropy(B256),
    PrivateKey(B256),
}

#[derive(Serialize, Deserialize)]
pub struct PrivateInfo {
    pub version: u8,
    pub private_key: PrivateKey,
}

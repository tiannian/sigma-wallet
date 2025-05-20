use std::collections::BTreeMap;

use alloy_primitives::{Address, B256, U256};
use serde::{Deserialize, Serialize};

#[derive(Default, Serialize, Deserialize)]
pub struct Eip155Account {
    pub address: String,
    pub nonce: u64,
    pub balance: BTreeMap<Address, U256>,
    pub name: String,
}

#[derive(Default, Serialize, Deserialize)]
pub struct SubAccount {
    pub eip155_account: BTreeMap<u64, Eip155Account>,
}

#[derive(Default, Serialize, Deserialize)]
pub struct PrivateInfo {
    pub entropy: B256,
}

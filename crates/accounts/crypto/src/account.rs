use std::{
    collections::BTreeMap,
    path::{Path, PathBuf},
};

use alloy_primitives::{Address, B256};
use anyhow::Result;
use bip32::{DerivationPath, Mnemonic, XPrv};
use rand_core::{OsRng, RngCore};
use sigwa_core::{EncryptedData, Guard, NetworkType};
use sigwa_wallet::Wallet;
use tokio::fs;

use crate::types::{
    BitcoinAccount, Eip155Account, PrivateInfo, PrivateKey, PrivateKeyType, SolanaAccount,
    SubAccount,
};

pub struct Account<'w> {
    sub_accounts: SubAccount,
    account_path: PathBuf,
    wallet: &'w Wallet,
}

impl<'w> Account<'w> {
    pub async fn new(account_path: impl AsRef<Path>, wallet: &'w Wallet) -> Result<Self> {
        let account_path = account_path.as_ref();
        let account_path_ = account_path.join("accounts.ejson");

        let entropy_path = account_path.join("entropy.ejson");

        if !entropy_path.exists() {
            return Err(anyhow::anyhow!("Entropy file not found"));
        }

        let account_encrypted_bytes = fs::read(account_path_).await?;

        let encrypted_data = EncryptedData::from_slice(&account_encrypted_bytes)?;

        let res = wallet.decrypt_auth_data(encrypted_data)?;

        let sub_accounts: SubAccount = serde_json::from_slice(&res)?;

        Ok(Self {
            sub_accounts,
            account_path: account_path.to_path_buf(),
            wallet,
        })
    }

    pub async fn create(
        account_path: impl AsRef<Path>,
        wallet: &'w Wallet,
        guard: &impl Guard,
    ) -> Result<Self> {
        let account_path = account_path.as_ref();
        let account_path_ = account_path.join("subaccounts.ejson");

        let sub_accounts = SubAccount::default();
        let data = serde_json::to_vec(&sub_accounts)?;
        fs::write(account_path_, data).await?;

        let entropy_path = account_path.join("entropy.ejson");
        let mut entropy = B256::default();
        OsRng.fill_bytes(&mut entropy.as_mut());

        let private_info = PrivateInfo {
            version: 1,
            private_key: PrivateKey::Entropy(entropy),
        };

        let private_info_data = serde_json::to_vec(&private_info)?;
        let encrypted_private_info = wallet.encrypt_transaction_data(&private_info_data, guard)?;
        fs::write(entropy_path, encrypted_private_info.to_vec()).await?;

        Ok(Self {
            sub_accounts,
            account_path: account_path.to_path_buf(),
            wallet,
        })
    }

    pub async fn import_private_key(
        &mut self,
        private_key: B256,
        network_type: NetworkType,
        account_path: impl AsRef<Path>,
        wallet: &'w Wallet,
        guard: &impl Guard,
    ) -> Result<Self> {
        let private_info = PrivateInfo {
            version: 1,
            private_key: PrivateKey::PrivateKey(private_key),
        };

        let private_info_data = serde_json::to_vec(&private_info)?;
        let encrypted_private_info = wallet.encrypt_transaction_data(&private_info_data, guard)?;
        fs::write(
            account_path.as_ref().join("entropy.ejson"),
            encrypted_private_info.to_vec(),
        )
        .await?;

        let mut sub_accounts = SubAccount {
            private_key_type: PrivateKeyType::PrivateKey,
            ..Default::default()
        };

        let data = serde_json::to_vec(&sub_accounts)?;
        match network_type {
            NetworkType::Eip155 => {
                let private_key = k256::ecdsa::SigningKey::from_bytes(&private_key.0.into())?;
                let address = Address::from_private_key(&private_key);
                sub_accounts.eip155_account.push(Eip155Account {
                    address,
                    nonce: 0,
                    balance: BTreeMap::new(),
                    name: "".to_string(),
                });
            }
            _ => {}
        }

        let encrypted_data = wallet.encrypt_auth_data(&data)?;
        fs::write(
            account_path.as_ref().join("accounts.ejson"),
            encrypted_data.to_vec(),
        )
        .await?;

        Ok(Self {
            sub_accounts,
            account_path: account_path.as_ref().to_path_buf(),
            wallet,
        })
    }

    pub fn sub_accounts(&self) -> &SubAccount {
        &self.sub_accounts
    }

    pub async fn add_sub_account(
        &mut self,
        name: &str,
        network_type: NetworkType,
        guard: &impl Guard,
    ) -> Result<()> {
        let seed_path = self.account_path.join(format!("seed.ejson"));

        let encrypted_seed = EncryptedData::from_slice(&fs::read(seed_path).await?)?;

        let seed_bytes = self
            .wallet
            .decrypt_transaction_data(encrypted_seed, guard)?;

        let private_info: PrivateInfo = serde_json::from_slice(&seed_bytes)?;
        let entropy = if let PrivateKey::Entropy(entropy) = private_info.private_key {
            entropy
        } else {
            return Err(anyhow::anyhow!("Unsupported private key"));
        };

        let mnemonic = Mnemonic::from_entropy(entropy.0, bip32::Language::English);
        let seed = mnemonic.to_seed("");

        match network_type {
            NetworkType::Eip155 => {
                let derivation_path: DerivationPath =
                    build_bip32_path(network_type, self.sub_accounts.eip155_account.len())
                        .parse()?;
                let wallet_xpub = XPrv::derive_from_path(seed, &derivation_path)?;

                let address = Address::from_public_key(wallet_xpub.public_key().public_key());
                let eip155_account = Eip155Account {
                    address,
                    nonce: 0,
                    balance: BTreeMap::new(),
                    name: name.to_string(),
                };

                self.sub_accounts.eip155_account.push(eip155_account);
            }
            NetworkType::Bitcoin => {
                let bitcoin_account = BitcoinAccount {
                    name: name.into(),
                    balance: Default::default(),
                };

                self.sub_accounts.bitcoin_account.push(bitcoin_account);
            }
            NetworkType::Solana => {
                let solana_account = SolanaAccount {
                    name: name.into(),
                    balance: Default::default(),
                };

                self.sub_accounts.solana_account.push(solana_account);
            }
        }

        Ok(())
    }

    pub fn remove_sub_account(&mut self, network_type: NetworkType, index: usize) -> Result<()> {
        match network_type {
            NetworkType::Eip155 => {
                self.sub_accounts.eip155_account.remove(index);
            }
            NetworkType::Bitcoin => {
                self.sub_accounts.bitcoin_account.remove(index);
            }
            NetworkType::Solana => {
                self.sub_accounts.solana_account.remove(index);
            }
        }

        Ok(())
    }

    pub async fn save(&self) -> Result<()> {
        let data = serde_json::to_vec(&self.sub_accounts)?;

        let encrypted_data = self.wallet.encrypt_auth_data(&data)?;

        fs::write(
            self.account_path.join("subaccounts.ejson"),
            encrypted_data.to_vec(),
        )
        .await?;

        Ok(())
    }

    pub async fn update_state(&mut self, _network_type: NetworkType, _index: usize) -> Result<()> {
        // TODO: update balance and nonce for different networks.

        Ok(())
    }
}

fn build_bip32_path(network_type: NetworkType, index: usize) -> String {
    match network_type {
        NetworkType::Eip155 => format!("m/44'/60'/0'/0/{}", index),
        NetworkType::Solana => format!("m/44'/501'/0'/0/{}", index),
        NetworkType::Bitcoin => format!("m/44'/0'/0'/0/{}", index),
    }
}

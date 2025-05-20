use std::path::{Path, PathBuf};

use anyhow::Result;
use sigwa_core::EncryptedData;
use sigwa_wallet::Wallet;
use tokio::fs;

use crate::types::SubAccount;

#[derive(Default)]
pub struct Account {
    sub_accounts: Vec<SubAccount>,
    account_path: PathBuf,
}

impl Account {
    pub async fn new(account_path: impl AsRef<Path>, wallet: &Wallet) -> Result<Self> {
        let account_path = account_path.as_ref();
        let account_path_ = account_path.join("subaccounts.ejson");

        let account_encrypted_bytes = fs::read(account_path_).await?;

        let encrypted_data = EncryptedData::from_slice(&account_encrypted_bytes)?;

        let res = wallet.decrypt_auth_data(encrypted_data)?;

        let sub_accounts: Vec<SubAccount> = serde_json::from_slice(&res)?;

        Ok(Self {
            sub_accounts,
            account_path: account_path.to_path_buf(),
        })
    }

    pub fn sub_accounts(&self) -> &[SubAccount] {
        self.sub_accounts.as_ref()
    }

    pub fn add_sub_account(&mut self, name: &str) -> Result<()> {
        // let 

        Ok(())
    }

    pub fn remove_sub_account(&mut self, index: usize) -> Result<()> {
        self.sub_accounts.remove(index);

        Ok(())
    }

    pub async fn save(&self, wallet: &Wallet) -> Result<()> {
        let data = serde_json::to_vec(&self.sub_accounts)?;

        let encrypted_data = wallet.encrypt_auth_data(&data)?;

        fs::write(
            self.account_path.join("subaccounts.ejson"),
            encrypted_data.to_vec(),
        )
        .await?;

        Ok(())
    }
}

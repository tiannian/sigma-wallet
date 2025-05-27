use std::path::{Path, PathBuf};

use anyhow::Result;
use sigwa_wallet::Wallet;
use tokio::{
    fs::{self, File},
    io::AsyncWriteExt,
};

use crate::{Account, AccountType};

pub struct Accounts<'a> {
    account_path: PathBuf,
    account_list: Vec<Account<'a>>,
    account_types: Vec<AccountType>,
}

impl<'a> Accounts<'a> {
    pub async fn new(home_path: impl AsRef<Path>, wallet: &'a Wallet) -> Result<Self> {
        let home_path = home_path.as_ref().to_path_buf();

        let account_path = home_path.join("account");

        fs::create_dir_all(&account_path).await?;

        let account_list_path = account_path.join("account_list.json");

        let account_types: Vec<AccountType> = if !account_list_path.exists() {
            // TODO: read all subaccount in account_path to build default list.

            let account_list = vec![];
            let mut file = File::create(account_list_path).await?;
            let account_list_str = serde_json::to_string(&account_list)?;
            file.write_all(account_list_str.as_bytes()).await?;
            account_list
        } else {
            let account_list_str = fs::read_to_string(&account_list_path).await?;
            serde_json::from_str(&account_list_str)?
        };

        let mut account_list = Vec::with_capacity(account_types.len());

        for (i, account_index) in account_types.iter().enumerate() {
            let account = match account_index {
                AccountType::Crypto => {
                    let path = account_path.join(format!("crypto_{}", i));
                    Account::Crypto(sigwa_account_crypto::Account::new(path, wallet).await?)
                }
                AccountType::CEXBinance => {
                    Account::CEXBinance(sigwa_account_cex_binance::Account::new(wallet))
                }
            };

            account_list.push(account);
        }

        Ok(Self {
            account_path,
            account_list,
            account_types,
        })
    }

    pub fn get_account(&self, index: usize) -> Result<&Account<'a>> {
        Ok(&self.account_list[index])
    }

    pub fn add_account(&mut self, account: Account<'a>) {
        self.account_types.push(account.get_account_type());
        self.account_list.push(account);
    }

    pub fn remove_account(&mut self, index: usize) {
        self.account_types.remove(index);
        self.account_list.remove(index);
    }

    pub fn account_len(&self) -> usize {
        self.account_list.len()
    }

    pub async fn save(&self) -> Result<()> {
        let account_list_path = self.account_path.join("account_list.json");
        let account_list_str = serde_json::to_string(&self.account_types)?;
        fs::write(account_list_path, account_list_str).await?;
        Ok(())
    }
}

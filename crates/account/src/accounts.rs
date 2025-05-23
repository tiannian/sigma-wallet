use std::path::{Path, PathBuf};

use anyhow::Result;
use tokio::{
    fs::{self, File},
    io::AsyncWriteExt,
};

use crate::SubAccountList;

pub struct Accounts {
    account_path: PathBuf,
    pub account_list: SubAccountList,
}

impl Accounts {
    pub async fn new(home_path: impl AsRef<Path>) -> Result<Self> {
        let home_path = home_path.as_ref().to_path_buf();

        let account_path = home_path.join("account");

        fs::create_dir_all(&account_path).await?;

        let account_list_path = account_path.join("account_list.json");

        let account_list = if !account_list_path.exists() {
            // TODO: read all subaccount in account_path to build default list.

            let account_list = SubAccountList { accounts: vec![] };
            let mut file = File::create(account_list_path).await?;
            let account_list_str = serde_json::to_string(&account_list)?;
            file.write_all(account_list_str.as_bytes()).await?;
            account_list
        } else {
            let account_list_str = fs::read_to_string(&account_list_path).await?;
            serde_json::from_str(&account_list_str)?
        };

        Ok(Self {
            account_path,
            account_list,
        })
    }

    pub async fn save(&self) -> Result<()> {
        let account_list_path = self.account_path.join("account_list.json");
        let account_list_str = serde_json::to_string(&self.account_list)?;
        fs::write(account_list_path, account_list_str).await?;
        Ok(())
    }
}

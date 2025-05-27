use serde::{Deserialize, Serialize};

pub enum Account<'a> {
    Crypto(sigwa_account_crypto::Account<'a>),
    CEXBinance(sigwa_account_cex_binance::Account<'a>),
}

impl<'a> Account<'a> {
    pub fn get_account_type(&self) -> AccountType {
        match self {
            Account::Crypto(_) => AccountType::Crypto,
            Account::CEXBinance(_) => AccountType::CEXBinance,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum AccountType {
    Crypto,
    CEXBinance,
}

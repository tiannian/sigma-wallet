pub enum Account<'a> {
    Crypto(sigwa_account_crypto::Account<'a>),
    CEXBinance(sigwa_account_cex_binance::Account<'a>),
}

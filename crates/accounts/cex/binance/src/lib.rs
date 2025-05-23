use sigwa_wallet::Wallet;

pub struct Account<'a> {
    wallet: &'a Wallet,
}

impl<'a> Account<'a> {
    pub fn new(wallet: &'a Wallet) -> Self {
        Self { wallet }
    }
}

pub trait Account {
    type SubAccount;

    fn name(&self) -> String;

    fn sub_accounts(&self) -> Vec<Self::SubAccount>;
}

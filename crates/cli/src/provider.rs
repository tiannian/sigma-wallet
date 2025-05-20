use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use sigwa_storages_file::JsonFileKeyValueStorage;
use sigwa_wallet::Provider;

#[derive(Parser)]
pub struct Args {
    /// Display provider information in long mode
    #[clap(short, long)]
    pub long: bool,
}

impl Args {
    pub async fn run(&self, home_path: PathBuf) -> Result<()> {
        let storage = JsonFileKeyValueStorage::new(home_path);

        let provider = Provider::new(&storage).await?;

        if !provider.is_initialized() {
            println!("Provider not initialized, please run `sigwa init` first");
            return Ok(());
        }

        let selected_rpc = provider
            .selector
            .get_selected_rpc()
            .ok_or(anyhow::anyhow!("Failed to get selected RPC"))?;

        let info = provider
            .get_info()
            .ok_or(anyhow::anyhow!("Failed to get provider info"))?;

        if self.long {
            println!("Selected RPC: {}", selected_rpc.name);
            println!("Selected RPC URL: {}", selected_rpc.rpc);

            println!();

            println!("CEX Proxy: {:?}", info.cex_proxy);
            println!("Crypto Price Provider: {:?}", info.crypto_price_provider);
            println!("Currency Rate Provider: {:?}", info.currency_rate_provider);

            return Ok(());
        }

        println!("Selected RPC: {}", selected_rpc.name);

        Ok(())
    }
}

use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;

mod init;
mod network;
mod provider;
mod wallet;

#[derive(Parser)]
pub struct Args {
    #[clap(long, env = "SIGWA_HOME")]
    pub home_path: Option<PathBuf>,

    #[clap(subcommand)]
    subcommand: Subcommand,
}

#[derive(Parser)]
pub enum Subcommand {
    /// Initialize the wallet
    Init(init::Args),
    /// Display provider information
    Provider(provider::Args),
    /// Display or modify network information
    Network(network::Args),
    /// Create, List or edit wallet.
    Wallet(wallet::Args),
}

impl Args {
    pub async fn run(self) -> Result<()> {
        let home_path = if let Some(path) = &self.home_path {
            path.clone()
        } else {
            let mut path = std::env::var("HOME").unwrap_or_else(|_| ".".to_string());
            path.push_str("/.sigwa");
            PathBuf::from(path)
        };

        match self.subcommand {
            Subcommand::Init(args) => args.run(home_path).await,
            Subcommand::Provider(args) => args.run(home_path).await,
            Subcommand::Network(args) => args.run(home_path).await,
            Subcommand::Wallet(args) => args.run(home_path).await,
        }?;

        Ok(())
    }
}

#[tokio::main]
async fn main() {
    let args = Args::parse();

    args.run().await.expect("Failed to run command");
}

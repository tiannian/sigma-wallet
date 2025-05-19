use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use sigwa_storages_sqlite::SqliteStorage;
use sigwa_wallet::Network;

#[derive(Parser)]
pub struct Args {
    #[clap(subcommand)]
    subcommand: Option<Subcommand>,
}

impl Args {
    pub async fn run(self, home_path: PathBuf) -> Result<()> {
        let subcommand = self.subcommand.unwrap_or_default();
        subcommand.run(home_path).await?;

        Ok(())
    }
}

#[derive(Parser)]
pub enum Subcommand {
    List {
        #[clap(short, long)]
        testnet: bool,
    },
    Edit,
    Add,
    Remove,
}

impl Default for Subcommand {
    fn default() -> Self {
        Self::List { testnet: false }
    }
}

impl Subcommand {
    pub async fn run(&self, home_path: PathBuf) -> Result<()> {
        match self {
            Self::List { testnet } => {
                let path = home_path.join("network.db");

                let storage = SqliteStorage::new(&path).await?;
                let network = Network::new();
                let names = network.select_all_network_names(&storage, *testnet).await?;

                println!("{}", names.join(", "));
            }
            Self::Edit => {}
            Self::Add => {}
            Self::Remove => {}
        }

        Ok(())
    }
}

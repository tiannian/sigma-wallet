use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use dialoguer::{Confirm, FuzzySelect, Select, theme::ColorfulTheme};
use sigwa_wallet::{Network, NetworkInfo};

#[derive(Parser)]
pub struct Args {
    #[clap(short, long)]
    testnet: bool,
}

impl Args {
    pub async fn run(self, home_path: PathBuf) -> Result<()> {
        let network = Network::new(&home_path).await?;
        let names = network
            .select_all_network_chainid_names(self.testnet)
            .await?;

        let theme = ColorfulTheme {
            prompt_style: console::Style::new().blue().bright(),
            ..Default::default()
        };

        let selection = FuzzySelect::with_theme(&theme)
            .with_prompt("Select a network")
            .items(&names.1)
            .interact_opt()?;

        if selection.is_none() {
            return Ok(());
        }

        // Safe to unwrap because we checked for None above
        let selection = selection.unwrap();

        // println!("{}", names.0[selection]);

        let operation = Select::with_theme(&theme)
            .with_prompt("Select an operation")
            .items(&["Show Detail", "Remove"])
            .interact_opt()?;

        if operation.is_none() {
            return Ok(());
        }

        // Safe to unwrap because we checked for None above
        match operation.unwrap() {
            0 => {
                let network = network.get_network(names.0[selection]).await?;
                show_detail(network).await?;
            }
            1 => {
                let confirm = Confirm::with_theme(&theme)
                    .with_prompt("Are you sure you want to remove this network?")
                    .interact()?;

                if confirm {
                    network.remove_network(names.0[selection]).await?;
                    println!("Network removed");
                }
            }
            _ => {}
        }

        Ok(())
    }
}

async fn show_detail(network: NetworkInfo) -> Result<()> {
    println!("{:?}", network);
    Ok(())
}

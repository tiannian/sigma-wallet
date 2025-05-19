use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use dialoguer::{Confirm, FuzzySelect, Input, Select, theme::ColorfulTheme};
use sigwa_wallet::Network;

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

        show_detail(&network, names.0[selection]).await?;

        // let operation = Select::with_theme(&theme)
        //     .with_prompt("Select an operation")
        //     .items(&["Show Detail", "Remove"])
        //     .interact_opt()?;

        // if operation.is_none() {
        //     return Ok(());
        // }

        // // Safe to unwrap because we checked for None above
        // match operation.unwrap() {
        //     0 => {
        //         let id = names.0[selection];

        //         show_detail(&network, id).await?;
        //     }
        //     1 => {
        //         let confirm = Confirm::with_theme(&theme)
        //             .with_prompt("Are you sure you want to remove this network?")
        //             .interact()?;

        //         if confirm {
        //             network.remove_network(names.0[selection]).await?;
        //             println!("Network removed");
        //         }
        //     }
        //     _ => {}
        // }

        Ok(())
    }
}

async fn show_detail(network: &Network, id: u32) -> Result<()> {
    let network_info = network.get_network(id).await?;

    let itmes = &[
        format!("Name: {}", network_info.name),
        format!("Network Type: {:?}", network_info.network_type),
        format!("Chain ID: {}", network_info.chain_id),
        format!("Symbol: {}", network_info.symbol),
        format!("Decimals: {}", network_info.decimals),
        format!("Slip44: {}", network_info.slip44),
        format!(
            "RPC URL: {}",
            network_info.rpc_urls[network_info.selected_rpc_url]
        ),
        format!(
            "Explorer: {}",
            network_info.explorers[network_info.selected_explorer].name
        ),
        "".into(),
        "[Delete This Network]".into(),
    ];

    let theme = ColorfulTheme {
        prompt_style: console::Style::new().blue().bright(),
        ..Default::default()
    };

    let selection = Select::with_theme(&theme)
        .with_prompt("Select an field to edit, or press [Esc] to exit")
        .items(itmes)
        .interact_opt()?;

    if selection.is_none() {
        return Ok(());
    }

    let selection = selection.unwrap();

    if selection == itmes.len() - 1 {
        let confirm = Confirm::with_theme(&theme)
            .with_prompt("Are you sure you want to remove this network?")
            .interact()?;

        if confirm {
            network.remove_network(id).await?;
        }
        return Ok(());
    }

    match selection {
        0 => {
            edit_field(
                network,
                id,
                "Name",
                "name",
                FiledType::Text(network_info.name),
            )
            .await?
        }
        1 => {
            edit_field(
                network,
                id,
                "Network Type",
                "network_type",
                FiledType::Number(network_info.network_type as u64),
            )
            .await?
        }
        2 => {
            edit_field(
                network,
                id,
                "Chain ID",
                "chain_id",
                FiledType::Text(network_info.chain_id),
            )
            .await?
        }
        3 => {
            edit_field(
                network,
                id,
                "Symbol",
                "symbol",
                FiledType::Text(network_info.symbol),
            )
            .await?
        }
        4 => {
            edit_field(
                network,
                id,
                "Decimals",
                "decimals",
                FiledType::Number(network_info.decimals as u64),
            )
            .await?
        }
        5 => {
            edit_field(
                network,
                id,
                "Slip44",
                "slip44",
                FiledType::Number(network_info.slip44),
            )
            .await?
        }
        _ => {}
    }

    Ok(())
}

enum FiledType {
    Text(String),
    Number(u64),
}

impl FiledType {
    fn to_string(&self) -> String {
        match self {
            FiledType::Text(s) => s.clone(),
            FiledType::Number(n) => n.to_string(),
        }
    }

    fn is_text(&self) -> bool {
        matches!(self, FiledType::Text(_))
    }

    fn is_number(&self) -> bool {
        matches!(self, FiledType::Number(_))
    }
}

async fn edit_field(
    network: &Network,
    id: u32,
    field: &str,
    sql_field: &str,
    value: FiledType,
) -> Result<()> {
    let theme = ColorfulTheme {
        prompt_style: console::Style::new().blue().bright(),
        ..Default::default()
    };

    let input = Input::with_theme(&theme)
        .with_prompt(format!("{}:", field))
        .default(value.to_string())
        .interact_text()?;

    if value.is_text() {
        network
            .update_network_text_field(id, sql_field, &input)
            .await?;
    } else if value.is_number() {
        let input = input.parse::<u32>()?;

        network
            .update_network_number_field(id, sql_field, input)
            .await?;
    }

    Ok(())
}

use anyhow::Result;

use crate::{Explorer, ExplorerType, NetworkInfo, NetworkType};

use super::eip155_model;

pub async fn load_remote(chain_list_provider: &str) -> Result<Vec<NetworkInfo>> {
    let response = reqwest::get(chain_list_provider).await?;

    let body: eip155_model::Chainlist = response.json().await?;

    let response = reqwest::get(&body.eip155.list).await?;
    let body: Vec<eip155_model::Eip155ChainInfo> = response.json().await?;

    let mut infos = Vec::new();

    for chain_info in body {
        let info = NetworkInfo {
            name: chain_info.name,
            network_type: NetworkType::Eip155,
            chain_id: chain_info.chain_id.to_string(),
            symbol: chain_info.native_currency.symbol,
            rpc_urls: chain_info.rpc.iter().map(|rpc| rpc.url.clone()).collect(),
            decimals: chain_info.native_currency.decimals,
            selected_rpc_url: 0,
            explorers: chain_info
                .explorers
                .iter()
                .map(|explorer| Explorer {
                    name: explorer.name.clone(),
                    url: explorer.url.clone(),
                    explorer_type: ExplorerType::Eip3091,
                })
                .collect(),
            selected_explorer: 0,
            slip44: chain_info.slip44,
        };

        infos.push(info);
    }

    Ok(infos)
}

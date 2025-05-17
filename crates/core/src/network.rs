use anyhow::Result;
use serde::{Deserialize, Serialize};

use crate::{Migration, MigrationType, SqlStorgae, SqlTransaction, SqlValue};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum NetworkType {
    Eip155,
    Solana,
    Bitcoin,
}

impl NetworkType {
    pub fn from_sql_value(value: &SqlValue) -> Result<Self> {
        match value {
            SqlValue::Int(value) => match value {
                0 => Ok(NetworkType::Eip155),
                1 => Ok(NetworkType::Solana),
                2 => Ok(NetworkType::Bitcoin),
                _ => Err(anyhow::anyhow!("invalid network type {}", value)),
            },
            _ => Err(anyhow::anyhow!("invalid network type")),
        }
    }
}

impl From<NetworkType> for i64 {
    fn from(value: NetworkType) -> Self {
        match value {
            NetworkType::Eip155 => 0,
            NetworkType::Solana => 1,
            NetworkType::Bitcoin => 2,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NetworkInfo {
    pub name: String,
    pub network_type: NetworkType,
    pub chain_id: String,
    pub symbol: String,
    pub rpc_urls: Vec<String>,
    pub decimals: u8,
    pub selected_rpc_url: usize,
    pub explorers: Vec<Explorer>,
    pub selected_explorer: usize,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ExplorerType {
    Eip3091,
}

impl ExplorerType {
    pub fn from_sql_value(value: &SqlValue) -> Result<Self> {
        match value {
            SqlValue::Int(value) => match value {
                0 => Ok(ExplorerType::Eip3091),
                _ => Err(anyhow::anyhow!("invalid explorer type {}", value)),
            },
            _ => Err(anyhow::anyhow!("invalid explorer type")),
        }
    }
}

impl From<ExplorerType> for i64 {
    fn from(value: ExplorerType) -> Self {
        match value {
            ExplorerType::Eip3091 => 0,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Explorer {
    pub name: String,
    pub url: String,
    pub explorer_type: ExplorerType,
}

#[derive(Debug, Default)]
pub struct Network {
    pub infos: Vec<NetworkInfo>,
}

impl Network {
    pub fn new() -> Self {
        Self { infos: vec![] }
    }

    pub fn migrations(&self) -> Vec<Migration> {
        let v1 = Migration {
            version: 1,
            description: "create networks table",
            migration_type: MigrationType::Up,
            sql: include_str!("../sql/0001-network.sql"),
        };

        vec![v1]
    }

    pub async fn load_remote(&mut self, chain_list_provider: &str) -> Result<()> {
        let response = reqwest::get(chain_list_provider).await?;

        let body: model::Chainlist = response.json().await?;

        let response = reqwest::get(&body.eip155.list).await?;
        let body: Vec<model::Eip155ChainInfo> = response.json().await?;

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
            };

            self.infos.push(info);
        }

        Ok(())
    }

    pub async fn save_local<S>(&self, storage: &S) -> Result<()>
    where
        S: SqlStorgae,
    {
        let mut txn = storage.begin().await?;

        let network_sql = "INSERT INTO networks (
            name,
            network_type,
            chain_id,
            symbol,
            decimals
        ) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT DO NOTHING";

        let network_rpc_sql = "INSERT INTO network_rpc (
            network_id,
            rpc_url,
            selected
        ) VALUES (?, ?, ?)
        ON CONFLICT DO NOTHING";

        let network_explorer_sql = "INSERT INTO network_explorer (
            network_id,
            name,
            url,
            explorer_type,
            selected
        ) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT DO NOTHING";

        for info in &self.infos {
            let result = txn
                .execute(
                    network_sql,
                    &[
                        info.name.as_str().into(),
                        (info.network_type as i64).into(),
                        info.chain_id.as_str().into(),
                        info.symbol.as_str().into(),
                        (info.decimals as i64).into(),
                    ],
                )
                .await?;

            let network_id = result.1;

            for (i, rpc_url) in info.rpc_urls.iter().enumerate() {
                txn.execute(
                    network_rpc_sql,
                    &[
                        network_id.into(),
                        rpc_url.as_str().into(),
                        (i == info.selected_rpc_url).into(),
                    ],
                )
                .await?;
            }

            for (i, explorer) in info.explorers.iter().enumerate() {
                txn.execute(
                    network_explorer_sql,
                    &[
                        network_id.into(),
                        explorer.name.as_str().into(),
                        explorer.url.as_str().into(),
                        (explorer.explorer_type as i64).into(),
                        (i == info.selected_explorer).into(),
                    ],
                )
                .await?;
            }
        }

        txn.commit().await?;

        Ok(())
    }

    pub async fn load_local<S>(&mut self, storage: &S) -> Result<()>
    where
        S: SqlStorgae,
    {
        self.infos.clear();

        let networks = storage.select("SELECT * FROM networks", &[]).await?;

        for network in networks {
            let network_id = network
                .get("id")
                .ok_or(anyhow::anyhow!("network id not found"))?;

            let network_type = NetworkType::from_sql_value(
                network
                    .get("network_type")
                    .ok_or(anyhow::anyhow!("network type not found"))?,
            )?;

            let chain_id = network
                .get("chain_id")
                .ok_or(anyhow::anyhow!("chain id not found"))?
                .as_i64()
                .ok_or(anyhow::anyhow!("chain id is not a number"))?;

            let symbol = network
                .get("symbol")
                .ok_or(anyhow::anyhow!("symbol not found"))?
                .as_str()
                .ok_or(anyhow::anyhow!("symbol is not a string"))?;

            let decimals = network
                .get("decimals")
                .ok_or(anyhow::anyhow!("decimals not found"))?
                .as_i64()
                .ok_or(anyhow::anyhow!("decimals is not a number"))?;

            let name = network
                .get("name")
                .ok_or(anyhow::anyhow!("name not found"))?
                .as_str()
                .ok_or(anyhow::anyhow!("name is not a string"))?;

            let mut network_info = NetworkInfo {
                name: name.to_string(),
                network_type,
                chain_id: chain_id.to_string(),
                symbol: symbol.to_string(),
                decimals: decimals as u8,
                selected_rpc_url: 0,
                explorers: vec![],
                selected_explorer: 0,
                rpc_urls: vec![],
            };

            let sql_rpc_urls = storage
                .select(
                    "SELECT * FROM network_rpc WHERE network_id = $1",
                    &[network_id.clone()],
                )
                .await?;

            for (i, rpc_url) in sql_rpc_urls.iter().enumerate() {
                let url = rpc_url
                    .get("rpc_url")
                    .ok_or(anyhow::anyhow!("rpc url not found"))?
                    .as_str()
                    .ok_or(anyhow::anyhow!("rpc url is not a string"))?;

                if rpc_url
                    .get("selected")
                    .ok_or(anyhow::anyhow!("selected not found"))?
                    .as_bool()
                    .unwrap_or(false)
                {
                    network_info.selected_rpc_url = i;
                }

                network_info.rpc_urls.push(url.to_string());
            }

            let sql_explorers = storage
                .select(
                    "SELECT * FROM network_explorer WHERE network_id = $1",
                    &[network_id.clone()],
                )
                .await?;

            for (i, explorer) in sql_explorers.iter().enumerate() {
                if explorer
                    .get("selected")
                    .ok_or(anyhow::anyhow!("selected not found"))?
                    .as_bool()
                    .unwrap_or(false)
                {
                    network_info.selected_explorer = i;
                }

                let name = explorer
                    .get("name")
                    .ok_or(anyhow::anyhow!("name not found"))?
                    .as_str()
                    .ok_or(anyhow::anyhow!("name is not a string"))?;

                let url = explorer
                    .get("url")
                    .ok_or(anyhow::anyhow!("url not found"))?
                    .as_str()
                    .ok_or(anyhow::anyhow!("url is not a string"))?;

                let explorer_type = explorer
                    .get("explorer_type")
                    .ok_or(anyhow::anyhow!("explorer type not found"))?;

                network_info.explorers.push(Explorer {
                    name: name.to_string(),
                    url: url.to_string(),
                    explorer_type: ExplorerType::from_sql_value(explorer_type)?,
                });
            }

            self.infos.push(network_info);
        }
        Ok(())
    }
}

mod model {
    use serde::{Deserialize, Serialize};

    use super::NetworkInfo;

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Eip155Rpc {
        pub url: String,
        pub tracking: Option<String>,
    }

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Eip155Currency {
        pub name: String,
        pub symbol: String,
        pub decimals: u8,
    }

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Eip155Explorer {
        pub name: String,
        pub url: String,
        pub standard: Option<String>,
    }

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Eip155ChainInfo {
        pub name: String,
        pub icon: Option<String>,
        pub rpc: Vec<Eip155Rpc>,
        #[serde(rename = "nativeCurrency")]
        pub native_currency: Eip155Currency,
        #[serde(rename = "chainId")]
        pub chain_id: u64,
        #[serde(default)]
        pub explorers: Vec<Eip155Explorer>,
    }

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Eip155 {
        pub list: String,
    }

    #[derive(Debug, Serialize, Deserialize)]
    pub struct Chainlist {
        pub eip155: Eip155,
        pub chains: Vec<NetworkInfo>,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_load_remote() {
        let mut network = Network::new();
        network
            .load_remote("https://assets.sw.openhk.cards/dev-v2/chainlist.json")
            .await
            .unwrap();
    }
}

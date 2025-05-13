use anyhow::Result;
use serde::{Deserialize, Serialize};

use crate::{KeyValueStorage, PersistentKeyValueStorage};

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "url")]
#[serde(rename_all = "kebab-case")]
pub enum CryptoPriceProvider {
    Coingecko(String),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "url")]
#[serde(rename_all = "kebab-case")]
pub enum CurrencyRateProvider {
    ExchangeRate(String),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "url")]
#[serde(rename_all = "kebab-case")]
pub enum CexProxy {
    Proxy(String),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProviderInfo {
    pub chain_list_provider: String,
    pub assets_list_provider: String,
    pub cex_proxy: CexProxy,
    pub crypto_price_provider: CryptoPriceProvider,
    pub currency_rate_provider: CurrencyRateProvider,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProviderRpc {
    pub name: String,
    pub rpc: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Provider {
    pub info: Option<ProviderInfo>,
    pub rpcs: Vec<ProviderRpc>,
    pub selected_rpc: usize,
}

impl Provider {
    pub fn new() -> Self {
        let rpc = ProviderRpc {
            name: "dev-v2".to_string(),
            rpc: "https://assets.sw.openhk.cards/dev-v2/provider.json".to_string(),
        };

        Self {
            rpcs: vec![rpc],
            selected_rpc: 0,
            info: None,
        }
    }

    pub async fn load_remote(&mut self) -> Result<()> {
        let rpc = &self.rpcs[self.selected_rpc];

        let response = reqwest::get(&rpc.rpc).await?;
        let body = response.json::<ProviderInfo>().await?;

        self.info = Some(body);

        Ok(())
    }

    pub async fn save_local<S>(&self, storage: &mut S) -> Result<()>
    where
        S: KeyValueStorage + PersistentKeyValueStorage,
    {
        storage
            .set("provider", &serde_json::to_string(self)?)
            .await?;

        Ok(())
    }

    pub async fn load_local<S>(&mut self, storage: &mut S) -> Result<()>
    where
        S: KeyValueStorage + PersistentKeyValueStorage,
    {
        if let Some(provider) = storage.get("provider").await? {
            *self = serde_json::from_str(&provider)?;
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_provider() {
        let mut provider = Provider::new();
        provider.load_remote().await.unwrap();
        println!("{:?}", provider);
    }
}

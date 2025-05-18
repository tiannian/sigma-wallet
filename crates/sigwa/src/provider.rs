use anyhow::Result;
use serde::{Deserialize, Serialize};

use sigwa_core::{KeyValueStorage, PersistentKeyValueStorage};

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
pub struct ProviderSelector {
    pub rpcs: Vec<ProviderRpc>,
    selected_rpc: usize,
}

impl ProviderSelector {
    pub fn new() -> Self {
        let rpc = ProviderRpc {
            name: "dev-v2".to_string(),
            rpc: "https://assets.sw.openhk.cards/dev-v2/provider.json".to_string(),
        };

        Self {
            rpcs: vec![rpc],
            selected_rpc: 0,
        }
    }

    pub fn get_selected_rpc(&self) -> Option<&ProviderRpc> {
        self.rpcs.get(self.selected_rpc)
    }

    pub fn set_selected_rpc(&mut self, index: usize) -> Result<()> {
        if index >= self.rpcs.len() {
            return Err(anyhow::anyhow!("Invalid RPC index"));
        }

        self.selected_rpc = index;

        Ok(())
    }
}

pub struct Provider {
    info: Option<ProviderInfo>,
    pub selector: ProviderSelector,
}

impl Provider {
    pub async fn new<S>(storage: &S) -> Result<Self>
    where
        S: KeyValueStorage + PersistentKeyValueStorage,
    {
        let selector = storage.get("provider", b"selector").await?;

        let selector = if let Some(selector) = selector {
            serde_json::from_slice(&selector)?
        } else {
            ProviderSelector::new()
        };

        let info = if let Some(info) = storage.get("provider", b"info").await? {
            serde_json::from_slice(&info)?
        } else {
            None
        };

        Ok(Self { info, selector })
    }

    pub fn is_initialized(&self) -> bool {
        self.info.is_some()
    }

    pub async fn load_remote(&mut self) -> Result<()> {
        let rpc = self.selector.get_selected_rpc().ok_or(anyhow::anyhow!(
            "Failed to get selected RPC, please reset provider"
        ))?;

        let response = reqwest::get(&rpc.rpc).await?;
        let body = response.json::<ProviderInfo>().await?;

        self.info = Some(body);

        Ok(())
    }

    pub fn set_selected_rpc(&mut self, index: usize) -> Result<()> {
        self.selector.set_selected_rpc(index)
    }

    pub fn get_info(&self) -> Option<&ProviderInfo> {
        self.info.as_ref()
    }

    pub async fn save<S>(&self, storage: &S) -> Result<()>
    where
        S: KeyValueStorage + PersistentKeyValueStorage,
    {
        storage
            .set("provider", b"selector", serde_json::to_vec(&self.selector)?)
            .await?;

        storage
            .set("provider", b"info", serde_json::to_vec(&self.info)?)
            .await?;

        Ok(())
    }
}

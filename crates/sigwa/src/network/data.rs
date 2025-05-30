use anyhow::Result;
use sigwa_core::{NetworkInfo, Version};
use sqlx::{SqlitePool, SqliteTransaction};

use rust_embed::Embed;
use tokio::io::AsyncBufReadExt;

#[derive(Embed)]
#[folder = "$CARGO_MANIFEST_DIR/../../assets/"]
struct Asset;

pub async fn init_data(pool: &SqlitePool) -> Result<()> {
    let data = Asset::get("networks.data").ok_or(anyhow::anyhow!("networks.data not found"))?;

    let data = data.data.as_ref();

    let mut lines = data.lines();

    let version = lines
        .next_line()
        .await?
        .ok_or(anyhow::anyhow!("version not found"))?;

    let version: Version = serde_json::from_str(&version)?;

    if version.name != "network" {
        return Err(anyhow::anyhow!("invalid version name"));
    }

    // TODO: store version in database

    let mut txn = pool.begin().await?;
    while let Some(line) = lines.next_line().await? {
        if line.is_empty() {
            continue;
        }

        let line = line.trim();

        let info: NetworkInfo = serde_json::from_str(line)?;

        save_local(&mut txn, info).await?;
    }

    txn.commit().await?;

    Ok(())
}

pub async fn save_local(txn: &mut SqliteTransaction<'static>, info: NetworkInfo) -> Result<()> {
    let network_sql = "INSERT INTO networks (
            name,
            network_type,
            chain_id,
            symbol,
            decimals,
            slip44,
            icon,
            native_asset
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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

    let result = sqlx::query(network_sql)
        .bind(info.name.as_str())
        .bind(info.network_type as i64)
        .bind(info.chain_id.as_str())
        .bind(info.symbol.as_str())
        .bind(info.decimals as i64)
        .bind(info.slip44 as i64)
        .bind(info.icon)
        .bind(info.native_asset)
        .execute(&mut **txn)
        .await?;

    let network_id = result.last_insert_rowid();

    for (i, rpc_url) in info.rpc_urls.iter().enumerate() {
        let result = sqlx::query(network_rpc_sql)
            .bind(network_id)
            .bind(rpc_url.as_str())
            .bind(i == info.selected_rpc_url)
            .execute(&mut **txn)
            .await?;

        log::debug!(
            "inserted network_rpc row effect rows: {:?}",
            result.rows_affected()
        );
    }

    for (i, explorer) in info.explorers.iter().enumerate() {
        let result = sqlx::query(network_explorer_sql)
            .bind(network_id)
            .bind(explorer.name.as_str())
            .bind(explorer.url.as_str())
            .bind(explorer.explorer_type as i64)
            .bind(i == info.selected_explorer)
            .execute(&mut **txn)
            .await?;

        log::debug!(
            "inserted network_explorer row effect rows: {:?}",
            result.rows_affected()
        );
    }

    Ok(())
}

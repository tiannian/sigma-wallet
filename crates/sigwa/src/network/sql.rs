use anyhow::Result;
use sqlx::{Row, SqlitePool};

use crate::NetworkInfo;

use super::{Explorer, ExplorerType, NetworkType};

pub async fn save_local(pool: &SqlitePool, infos: &[NetworkInfo]) -> Result<()> {
    let mut txn = pool.begin().await?;

    let network_sql = "INSERT INTO networks (
            name,
            network_type,
            chain_id,
            symbol,
            decimals,
            slip44
        ) VALUES (?, ?, ?, ?, ?, ?)
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

    for info in infos {
        let result = sqlx::query(network_sql)
            .bind(info.name.as_str())
            .bind(info.network_type as i64)
            .bind(info.chain_id.as_str())
            .bind(info.symbol.as_str())
            .bind(info.decimals as i64)
            .bind(info.slip44 as i64)
            .execute(&mut *txn)
            .await?;

        let network_id = result.last_insert_rowid();

        for (i, rpc_url) in info.rpc_urls.iter().enumerate() {
            let result = sqlx::query(network_rpc_sql)
                .bind(network_id)
                .bind(rpc_url.as_str())
                .bind(i == info.selected_rpc_url)
                .execute(&mut *txn)
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
                .execute(&mut *txn)
                .await?;

            log::debug!(
                "inserted network_explorer row effect rows: {:?}",
                result.rows_affected()
            );
        }
    }

    txn.commit().await?;

    Ok(())
}

pub async fn select_all_network_chainid_names(
    pool: &SqlitePool,
    testnet: bool,
) -> Result<(Vec<u32>, Vec<String>)> {
    let input = if testnet {
        "SELECT id, chain_id, name FROM networks"
    } else {
        "SELECT id, chain_id, name FROM networks WHERE slip44 != 1"
    };

    let result = sqlx::query(input).fetch_all(pool).await?;

    let mut ids = Vec::new();
    let mut names = Vec::new();

    for row in result {
        let id: u32 = row.try_get("id")?;
        let chain_id: String = row.try_get("chain_id")?;
        let name: String = row.try_get("name")?;

        ids.push(id);
        names.push(format!("{}: {}", chain_id, name));
    }

    Ok((ids, names))
}

pub async fn remove_network(pool: &SqlitePool, id: u32) -> Result<()> {
    sqlx::query("DELETE FROM networks WHERE id = ?")
        .bind(id)
        .execute(pool)
        .await?;

    Ok(())
}

pub async fn get_network(pool: &SqlitePool, id: u32) -> Result<NetworkInfo> {
    let result = sqlx::query("SELECT * FROM networks WHERE id = ?")
        .bind(id)
        .fetch_one(pool)
        .await?;

    let chain_id: String = result.try_get("chain_id")?;

    let name: String = result.try_get("name")?;

    let network_type: NetworkType = NetworkType::from_u32(result.try_get("network_type")?)?;

    let symbol: String = result.try_get("symbol")?;

    let decimals: i64 = result.try_get("decimals")?;

    let slip44: i64 = result.try_get("slip44")?;

    let rpc_urls_result =
        sqlx::query("SELECT rpc_url, selected FROM network_rpc WHERE network_id = ?")
            .bind(id)
            .fetch_all(pool)
            .await?;

    let mut rpc_urls = Vec::new();
    let mut selected_rpc_url = 0usize;
    for (i, row) in rpc_urls_result.iter().enumerate() {
        let rpc_url: String = row.try_get("rpc_url")?;
        let selected: bool = row.try_get("selected")?;

        rpc_urls.push(rpc_url.to_string());
        if selected {
            selected_rpc_url = i;
        }
    }

    let explorers_result = sqlx::query(
        "SELECT name, url, explorer_type, selected FROM network_explorer WHERE network_id = ?",
    )
    .bind(id)
    .fetch_all(pool)
    .await?;

    let mut explorers = Vec::new();
    let mut selected_explorer = 0usize;
    for (i, row) in explorers_result.iter().enumerate() {
        let name: String = row.try_get("name")?;
        let url: String = row.try_get("url")?;
        let explorer_type: ExplorerType = ExplorerType::from_u32(row.try_get("explorer_type")?)?;
        let selected: bool = row.try_get("selected")?;

        explorers.push(Explorer {
            name: name.to_string(),
            url: url.to_string(),
            explorer_type,
        });
        if selected {
            selected_explorer = i;
        }
    }

    Ok(NetworkInfo {
        name: name.to_string(),
        network_type,
        chain_id: chain_id.to_string(),
        symbol: symbol.to_string(),
        rpc_urls,
        decimals: decimals as u8,
        selected_rpc_url,
        explorers,
        selected_explorer,
        slip44: slip44 as u64,
    })
}

pub async fn update_network_text_filed(
    pool: &SqlitePool,
    id: u32,
    field: &str,
    value: &str,
) -> Result<()> {
    let sql = format!(
        "UPDATE networks SET {} = ?, is_user_added = TRUE WHERE id = ?",
        field
    );

    let result = sqlx::query(&sql).bind(value).bind(id).execute(pool).await?;

    log::debug!(
        "updated network row effect rows: {:?}",
        result.rows_affected()
    );

    Ok(())
}

pub async fn update_network_number_filed(
    pool: &SqlitePool,
    id: u32,
    field: &str,
    value: u32,
) -> Result<()> {
    let sql = format!("UPDATE networks SET {} = ? WHERE id = ?", field);

    let result = sqlx::query(&sql).bind(value).bind(id).execute(pool).await?;

    log::debug!(
        "updated network row effect rows: {:?}",
        result.rows_affected()
    );

    Ok(())
}

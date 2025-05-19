use anyhow::Result;
use sigwa_core::{SqlStorgae, SqlTransaction};

use crate::NetworkInfo;

pub async fn save_local<S>(infos: &[NetworkInfo], storage: &S) -> Result<()>
where
    S: SqlStorgae,
{
    let mut txn = storage.begin().await?;

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
        let result = txn
            .execute(
                network_sql,
                &[
                    info.name.as_str().into(),
                    (info.network_type as i64).into(),
                    info.chain_id.as_str().into(),
                    info.symbol.as_str().into(),
                    (info.decimals as i64).into(),
                    (info.slip44 as i64).into(),
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

use anyhow::Result;
use sigwa_core::{Migration, MigrationType, SqlStorgae};

use super::{remote, sql};

pub struct Network {}

impl Network {
    pub fn new() -> Self {
        Self {}
    }

    pub async fn migrations<S>(&self, storage: &S) -> Result<()>
    where
        S: SqlStorgae,
    {
        let v1 = Migration {
            version: 1,
            description: "create networks table",
            migration_type: MigrationType::Up,
            sql: include_str!("../../../../sql/0001-network.sql"),
        };

        storage.migrate(vec![v1]).await?;

        Ok(())
    }

    pub async fn load_remote<S>(&mut self, chain_list_provider: &str, storage: &S) -> Result<()>
    where
        S: SqlStorgae,
    {
        let infos = remote::load_remote(chain_list_provider).await?;
        sql::save_local(&infos, storage).await?;

        Ok(())
    }
}

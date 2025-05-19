use std::path::Path;

use anyhow::Result;
use sigwa_core::{Migration, MigrationType};
use sqlx::{SqlitePool, migrate::Migrator};
use tokio::fs::File;

use crate::migration;

use super::{NetworkInfo, remote, sql};

#[derive(Debug)]
pub struct Network {
    pool: SqlitePool,
    is_initialized: bool,
}

impl Network {
    pub async fn new(path: &impl AsRef<Path>) -> Result<Self> {
        let path = path.as_ref().join("network.db");

        let is_initialized = path.exists();

        if !is_initialized {
            File::create(&path).await?;
        }

        let pool = SqlitePool::connect(&format!("sqlite://{}", path.display())).await?;

        Ok(Self {
            pool,
            is_initialized,
        })
    }

    pub fn is_initialized(&self) -> bool {
        self.is_initialized
    }

    pub async fn migrate(&self) -> Result<()> {
        let v1 = Migration {
            version: 1,
            description: "create networks table",
            migration_type: MigrationType::Up,
            sql: include_str!("../../../../sql/0001-network.sql"),
        };

        let list = migration::MigrationList::new(vec![v1]);

        let migrator = Migrator::new(list).await?;

        migrator.run(&self.pool).await?;

        Ok(())
    }

    pub async fn load_remote(&mut self, chain_list_provider: &str) -> Result<()> {
        let infos = remote::load_remote(chain_list_provider).await?;
        sql::save_local(&mut self.pool, &infos).await?;

        Ok(())
    }

    pub async fn select_all_network_chainid_names(
        &self,
        testnet: bool,
    ) -> Result<(Vec<u32>, Vec<String>)> {
        sql::select_all_network_chainid_names(&self.pool, testnet).await
    }

    pub async fn remove_network(&self, id: u32) -> Result<()> {
        sql::remove_network(&self.pool, id).await?;
        Ok(())
    }

    pub async fn get_network(&self, id: u32) -> Result<NetworkInfo> {
        sql::get_network(&self.pool, id).await
    }
}

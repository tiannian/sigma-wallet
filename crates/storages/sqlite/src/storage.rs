use std::{collections::BTreeMap, path::Path};

use anyhow::Result;
use async_trait::async_trait;
use sigwa_core::{Migration, SqlStorgae, SqlValue};
use sqlx::{SqlitePool, migrate::Migrator};
use tokio::fs::File;

use crate::SqliteTransaction;

use super::{migration, utils};

pub struct SqliteStorage {
    pool: SqlitePool,
}

impl SqliteStorage {
    pub async fn new(path: &impl AsRef<Path>) -> Result<Self> {
        File::create(path).await?;

        let pool = SqlitePool::connect(&format!("sqlite://{}", path.as_ref().display())).await?;

        Ok(Self { pool })
    }

    async fn _execute(&self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)> {
        utils::execute(&self.pool, sql, values).await
    }

    async fn _select(
        &self,
        sql: &str,
        values: &[SqlValue],
    ) -> Result<Vec<BTreeMap<String, SqlValue>>> {
        utils::select(&self.pool, sql, values).await
    }

    async fn _migrate(&self, migrations: Vec<Migration>) -> Result<()> {
        let list = migration::MigrationList::new(migrations);

        let migrator = Migrator::new(list).await?;

        migrator.run(&self.pool).await?;

        Ok(())
    }

    async fn _begin<'a>(&'a self) -> Result<SqliteTransaction<'a>> {
        let tx = self.pool.begin().await?;

        Ok(SqliteTransaction { txn: tx })
    }
}

#[async_trait]
impl SqlStorgae for SqliteStorage {
    type Transaction<'a>
        = SqliteTransaction<'a>
    where
        Self: 'a;

    async fn migrate(&self, migrations: Vec<Migration>) -> Result<()> {
        self._migrate(migrations).await
    }

    async fn begin(&self) -> Result<Self::Transaction<'_>> {
        self._begin().await
    }

    async fn execute(&self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)> {
        self._execute(sql, values).await
    }

    async fn select(
        &self,
        sql: &str,
        values: &[SqlValue],
    ) -> Result<Vec<BTreeMap<String, SqlValue>>> {
        self._select(sql, values).await
    }
}

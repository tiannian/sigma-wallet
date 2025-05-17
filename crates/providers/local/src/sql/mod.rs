use std::collections::BTreeMap;

use anyhow::Result;
use async_trait::async_trait;
use sigwa_core::{Migration, SqlStorgae, SqlValue};
use sqlx::{Column, Row, SqlitePool, migrate::Migrator, sqlite::SqlitePoolOptions};

mod migration;
mod utils;

pub struct LocalSqlStorage {
    pool: SqlitePool,
}

impl LocalSqlStorage {
    pub async fn new(connection_string: &str) -> Result<Self> {
        let pool = SqlitePool::connect(connection_string).await?;

        Ok(Self { pool })
    }

    async fn _execute(&self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)> {
        let mut result = sqlx::query(sql);

        for value in values {
            match value {
                SqlValue::String(value) => result = result.bind(value),
                SqlValue::Bool(value) => result = result.bind(value),
                SqlValue::Int(value) => result = result.bind(value),
                SqlValue::Float(value) => result = result.bind(value),
                SqlValue::Null => result = result.bind(None::<&str>),
                SqlValue::Blob(value) => result = result.bind(value),
            }
        }

        let res = result.execute(&self.pool).await?;

        Ok((res.rows_affected(), res.last_insert_rowid()))
    }

    async fn _select(
        &self,
        sql: &str,
        values: &[SqlValue],
    ) -> Result<Vec<BTreeMap<String, SqlValue>>> {
        let mut result = sqlx::query(sql);

        for value in values {
            match value {
                SqlValue::String(value) => result = result.bind(value),
                SqlValue::Bool(value) => result = result.bind(value),
                SqlValue::Int(value) => result = result.bind(value),
                SqlValue::Float(value) => result = result.bind(value),
                SqlValue::Null => result = result.bind(None::<&str>),
                SqlValue::Blob(value) => result = result.bind(value),
            }
        }

        let res = result.fetch_all(&self.pool).await?;

        let mut result = Vec::new();

        for row in res {
            let mut map = BTreeMap::new();

            for (i, column) in row.columns().iter().enumerate() {
                let v = row.try_get_raw(i)?;

                map.insert(
                    column.name().to_string(),
                    utils::sqlite_value_to_sql_value(v)?,
                );
            }
            result.push(map);
        }

        Ok(result)
    }

    async fn _migrate(&self, migrations: Vec<Migration>) -> Result<()> {
        let list = migration::MigrationList::new(migrations);

        let migrator = Migrator::new(list).await?;

        migrator.run(&self.pool).await?;

        Ok(())
    }
}

#[async_trait]
impl SqlStorgae for LocalSqlStorage {
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

    async fn migrate(&self, migrations: Vec<Migration>) -> Result<()> {
        self._migrate(migrations).await
    }
}

#[cfg(test)]
mod tests {
    use sigwa_core::{Network, SqlStorgae};

    use crate::LocalSqlStorage;

    #[tokio::test]
    async fn test_load_remote() {
        let mut network = Network::new();
        // network
        //     .load_remote("https://assets.sw.openhk.cards/dev-v2/chainlist.json")
        //     .await
        //     .unwrap();

        let tempdir = tempfile::tempdir().unwrap();

        let path = format!("sqlite://{}/sigwa.db", tempdir.path().display());

        let storage = LocalSqlStorage::new(&path).await.unwrap();

        storage.migrate(network.migrations()).await.unwrap();

        // network.save_local(&storage).await.unwrap();
    }
}

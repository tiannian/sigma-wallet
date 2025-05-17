use std::collections::BTreeMap;

use anyhow::Result;
use async_trait::async_trait;
use sigwa_core::{SqlTransaction, SqlValue};
use sqlx::{Sqlite, Transaction};

use super::utils;

pub struct LocalSqlTransaction<'c> {
    pub(crate) txn: Transaction<'c, Sqlite>,
}

impl<'c> LocalSqlTransaction<'c> {
    async fn _execute(&mut self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)> {
        utils::execute(&mut *self.txn, sql, values).await
    }

    async fn _select(
        &mut self,
        sql: &str,
        values: &[SqlValue],
    ) -> Result<Vec<BTreeMap<String, SqlValue>>> {
        utils::select(&mut *self.txn, sql, values).await
    }
}

#[async_trait]
impl<'c> SqlTransaction for LocalSqlTransaction<'c> {
    async fn execute(&mut self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)> {
        self._execute(sql, values).await
    }

    async fn select(
        &mut self,
        sql: &str,
        values: &[SqlValue],
    ) -> Result<Vec<BTreeMap<String, SqlValue>>> {
        self._select(sql, values).await
    }

    async fn commit(self) -> Result<()> {
        self.txn.commit().await?;

        Ok(())
    }
}

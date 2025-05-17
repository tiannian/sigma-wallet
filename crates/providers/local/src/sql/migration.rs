use std::{error::Error, pin::Pin};

use anyhow::Result;
use sigwa_core::{Migration, MigrationType};

use sqlx::migrate::{
    Migration as SqlxMigration, MigrationSource, MigrationType as SqlxMigrationType,
};

#[derive(Debug)]
pub struct MigrationList(Vec<Migration>);

impl From<Vec<Migration>> for MigrationList {
    fn from(migrations: Vec<Migration>) -> Self {
        Self(migrations)
    }
}

impl MigrationList {
    pub fn new(migrations: Vec<Migration>) -> Self {
        Self(migrations)
    }

    async fn _resolve(self) -> Result<Vec<SqlxMigration>> {
        let mut migrations = Vec::new();

        for migration in self.0 {
            migrations.push(SqlxMigration::new(
                migration.version,
                migration.description.into(),
                migration_type_to_sqlx(migration.migration_type),
                migration.sql.into(),
                true,
            ));
        }

        Ok(migrations)
    }
}

impl MigrationSource<'static> for MigrationList {
    fn resolve(
        self,
    ) -> Pin<
        Box<
            dyn Future<Output = Result<Vec<SqlxMigration>, Box<dyn Error + Send + Sync>>>
                + Send
                + 'static,
        >,
    > {
        Box::pin(async move {
            let migrations = self.resolve().await?;
            Ok(migrations)
        })
    }
}

fn migration_type_to_sqlx(migration_type: MigrationType) -> SqlxMigrationType {
    match migration_type {
        MigrationType::Simple => SqlxMigrationType::Simple,
        MigrationType::Up => SqlxMigrationType::ReversibleUp,
        MigrationType::Down => SqlxMigrationType::ReversibleDown,
    }
}

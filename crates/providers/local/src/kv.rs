use anyhow::Result;
use redb::{ReadOnlyTable, Table, TableDefinition};

pub struct LocalKeyValueStorage {
    db: redb::Database,
}

impl LocalKeyValueStorage {
    pub fn new<B>(backend: B) -> Result<Self>
    where
        B: redb::StorageBackend,
    {
        let db = redb::Database::builder().create_with_backend(backend)?;

        Ok(Self { db })
    }

    pub fn get(&self, table: &str, key: &[u8]) -> Result<Option<Vec<u8>>> {
        let txn = self.db.begin_read()?;

        let table: ReadOnlyTable<&[u8], Vec<u8>> = txn.open_table(TableDefinition::new(table))?;

        let value = table.get(key)?;

        if let Some(value) = value {
            Ok(Some(value.value()))
        } else {
            Ok(None)
        }
    }

    pub fn set(&self, table: &str, key: &[u8], value: Vec<u8>) -> Result<()> {
        let txn = self.db.begin_write()?;

        {
            let mut table: Table<&[u8], Vec<u8>> = txn.open_table(TableDefinition::new(table))?;

            table.insert(key, value)?;
        }

        txn.commit()?;

        Ok(())
    }

    pub fn remove(&self, table: &str, key: &[u8]) -> Result<()> {
        let txn = self.db.begin_write()?;

        {
            let mut table: Table<&[u8], Vec<u8>> = txn.open_table(TableDefinition::new(table))?;

            table.remove(key)?;
        }

        txn.commit()?;

        Ok(())
    }
}

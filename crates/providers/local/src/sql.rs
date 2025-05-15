use std::collections::BTreeMap;

use anyhow::Result;
use sigwa_core::SqlValue;
use sqlx::{Column, Row, SqlitePool, TypeInfo, Value, ValueRef, sqlite::SqliteValueRef};

pub struct LocalSqlStorage {
    pool: SqlitePool,
}

impl LocalSqlStorage {
    pub async fn new(connection_string: &str) -> Result<Self> {
        let pool = SqlitePool::connect(connection_string).await?;

        Ok(Self { pool })
    }

    pub async fn execute(&self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)> {
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

    pub async fn select(
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

                map.insert(column.name().to_string(), sqlite_value_to_sql_value(v)?);
            }
            result.push(map);
        }

        Ok(result)
    }
}

fn sqlite_value_to_sql_value(v: SqliteValueRef) -> Result<SqlValue> {
    if v.is_null() {
        return Ok(SqlValue::Null);
    }

    let res = match v.type_info().name() {
        "TEXT" => {
            if let Ok(v) = v.to_owned().try_decode() {
                SqlValue::String(v)
            } else {
                SqlValue::Null
            }
        }
        "REAL" => {
            if let Ok(v) = v.to_owned().try_decode::<f64>() {
                SqlValue::Float(v)
            } else {
                SqlValue::Null
            }
        }
        "INTEGER" | "NUMERIC" => {
            if let Ok(v) = v.to_owned().try_decode::<i64>() {
                SqlValue::Int(v)
            } else {
                SqlValue::Null
            }
        }
        "BOOLEAN" => {
            if let Ok(v) = v.to_owned().try_decode() {
                SqlValue::Bool(v)
            } else {
                SqlValue::Null
            }
        }
        // "DATE" => {
        //     if let Ok(v) = v.to_owned().try_decode::<Date>() {
        //         SqlValue::String(v.to_string())
        //     } else {
        //         SqlValue::Null
        //     }
        // }
        // "TIME" => {
        //     if let Ok(v) = v.to_owned().try_decode::<Time>() {
        //         SqlValue::String(v.to_string())
        //     } else {
        //         SqlValue::Null
        //     }
        // }
        // "DATETIME" => {
        //     if let Ok(v) = v.to_owned().try_decode::<PrimitiveDateTime>() {
        //         SqlValue::String(v.to_string())
        //     } else {
        //         SqlValue::Null
        //     }
        // }
        "BLOB" => {
            if let Ok(v) = v.to_owned().try_decode::<Vec<u8>>() {
                SqlValue::Blob(v)
            } else {
                SqlValue::Null
            }
        }
        "NULL" => SqlValue::Null,
        _ => {
            return Err(anyhow::anyhow!(
                "Unsupported datatype: {}",
                v.type_info().name()
            ));
        }
    };

    Ok(res)
}

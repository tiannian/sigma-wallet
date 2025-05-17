use std::collections::BTreeMap;

use anyhow::Result;
use sigwa_core::SqlValue;
use sqlx::{Column, Executor, Row, Sqlite, TypeInfo, Value, ValueRef, sqlite::SqliteValueRef};

pub fn sqlite_value_to_sql_value(v: SqliteValueRef) -> Result<SqlValue> {
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

pub async fn execute<'a, E>(executor: E, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)>
where
    E: Executor<'a, Database = Sqlite>,
{
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

    let res = result.execute(executor).await?;

    Ok((res.rows_affected(), res.last_insert_rowid()))
}

pub async fn select<'a, E>(
    executor: E,
    sql: &str,
    values: &[SqlValue],
) -> Result<Vec<BTreeMap<String, SqlValue>>>
where
    E: Executor<'a, Database = Sqlite>,
{
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

    let res = result.fetch_all(executor).await?;

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

use anyhow::Result;
use sigwa_core::SqlValue;
use sqlx::{TypeInfo, Value, ValueRef, sqlite::SqliteValueRef};

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

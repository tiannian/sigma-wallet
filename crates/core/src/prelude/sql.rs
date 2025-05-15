use std::collections::BTreeMap;

use anyhow::Result;
use async_trait::async_trait;

#[derive(Debug, Clone)]
pub enum SqlValue {
    Null,
    String(String),
    Int(i64),
    Float(f64),
    Bool(bool),
    Blob(Vec<u8>),
}

macro_rules! define_sql_value_from {
    ($t:ty, $name:ident) => {
        impl From<$t> for SqlValue {
            fn from(value: $t) -> Self {
                SqlValue::$name(value.into())
            }
        }
    };
}

define_sql_value_from!(String, String);
define_sql_value_from!(i64, Int);
define_sql_value_from!(f64, Float);
define_sql_value_from!(bool, Bool);
define_sql_value_from!(&str, String);
define_sql_value_from!(Vec<u8>, Blob);
impl<T: Into<SqlValue>> From<Option<T>> for SqlValue {
    fn from(value: Option<T>) -> Self {
        if let Some(value) = value {
            value.into()
        } else {
            SqlValue::Null
        }
    }
}

macro_rules! define_sql_value_as_type {
    ($name:ident, $type:ty, $as_name:ident) => {
        impl SqlValue {
            pub fn $as_name(&self) -> Option<$type> {
                match self {
                    SqlValue::$name(value) => Some(*value),
                    _ => None,
                }
            }
        }
    };
}

define_sql_value_as_type!(Int, i64, as_i64);
define_sql_value_as_type!(Float, f64, as_f64);
define_sql_value_as_type!(Bool, bool, as_bool);

impl SqlValue {
    pub fn as_str(&self) -> Option<&str> {
        match self {
            SqlValue::String(value) => Some(value),
            _ => None,
        }
    }

    pub fn as_blob(&self) -> Option<&[u8]> {
        match self {
            SqlValue::Blob(value) => Some(value),
            _ => None,
        }
    }
}

#[async_trait]
pub trait SqlStorgae {
    async fn execute(&self, sql: &str, values: &[SqlValue]) -> Result<(u64, i64)>;

    async fn select(
        &self,
        sql: &str,
        values: &[SqlValue],
    ) -> Result<Vec<BTreeMap<String, SqlValue>>>;
}

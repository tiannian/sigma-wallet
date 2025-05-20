use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Version {
    pub name: String,
    pub version: u64,
}

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SubAccountList {
    pub accounts: Vec<String>,
}

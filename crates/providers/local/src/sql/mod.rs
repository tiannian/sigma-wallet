pub mod migration;

mod storage;
pub use storage::LocalSqlStorage;

mod utils;

mod txn;
pub use txn::LocalSqlTransaction;

// #[cfg(test)]
// mod tests {
//     use sigwa_core::{Network, SqlStorgae};

//     use crate::LocalSqlStorage;

//     #[tokio::test]
//     async fn test_load_remote() {
//         let mut network = Network::new();
//         network
//             .load_remote("https://assets.sw.openhk.cards/dev-v2/chainlist.json")
//             .await
//             .unwrap();

//         let storage = LocalSqlStorage::new(&"/tmp/sigwa_test.db").await.unwrap();

//         storage.migrate(network.migrations()).await.unwrap();

//         println!("start to write network to local storage");

//         network.save_local(&storage).await.unwrap();
//     }
// }

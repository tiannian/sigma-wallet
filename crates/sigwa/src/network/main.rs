use sigwa_core::{Migration, MigrationType};

pub struct Network {}

impl Network {
    pub fn new() -> Self {
        Self {}
    }

    pub fn migrations(&self) -> Vec<Migration> {
        let v1 = Migration {
            version: 1,
            description: "create networks table",
            migration_type: MigrationType::Up,
            sql: include_str!("../../../../sql/0001-network.sql"),
        };

        vec![v1]
    }

    // pub fn load_remote
}

use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;

#[derive(Parser)]
pub struct Args {
    #[clap(subcommand)]
    subcommand: Option<Subcommand>,
}

impl Args {
    pub async fn run(self, home_path: PathBuf) -> Result<()> {
        let subcommand = self.subcommand.unwrap_or_default();
        subcommand.run(home_path).await?;

        Ok(())
    }
}

#[derive(Parser, Default)]
pub enum Subcommand {
    #[default]
    List,
    Edit,
    Add,
    Remove,
}

impl Subcommand {
    pub async fn run(&self, home_path: PathBuf) -> Result<()> {
        Ok(())
    }
}

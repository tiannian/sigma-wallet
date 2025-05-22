use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;

#[derive(Debug, Parser)]
pub struct Args {}

impl Args {
    pub async fn run(self, home_path: PathBuf) -> Result<()> {
        Ok(())
    }
}

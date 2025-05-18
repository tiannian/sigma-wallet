use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;

#[derive(Parser)]
pub struct Args {
    #[clap(short, long, env = "SIGWA_HOME")]
    pub home_path: Option<PathBuf>,

    #[clap(short, long, env = "SIGWA_KEY")]
    pub password: String,
}

impl Args {
    pub fn run(&self) -> Result<()> {
        Ok(())
    }
}

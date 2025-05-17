use anyhow::Result;
use clap::Parser;

#[derive(Parser)]
pub struct Args {
    #[clap(short, long)]
    pub key: String,
}

impl Args {
    pub fn run(&self) -> Result<()> {
        Ok(())
    }
}

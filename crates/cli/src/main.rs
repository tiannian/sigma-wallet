use anyhow::Result;
use clap::Parser;

mod init;
mod provider;

#[derive(Parser)]
pub struct Args {
    #[clap(subcommand)]
    subcommand: Subcommand,
}

#[derive(Parser)]
pub enum Subcommand {
    Init(init::Args),
    Provider(provider::Args),
}

impl Args {
    pub fn run(&self) -> Result<()> {
        Ok(())
    }
}

fn main() {
    let args = Args::parse();

    args.run().expect("Failed to run command");
}

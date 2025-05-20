use std::path::PathBuf;

use anyhow::Result;
use clap::Parser;
use dialoguer::theme::ColorfulTheme;
use rand_core::OsRng;
use sigwa_guards_password::PasswordGuard;
use sigwa_storages_file::JsonFileKeyValueStorage;
use sigwa_wallet::{Network, Provider, Wallet};

#[derive(Parser)]
pub struct Args {
    #[clap(short, long, env = "SIGWA_KEY")]
    pub password: Option<String>,
}

impl Args {
    pub async fn run(self, home_path: PathBuf) -> Result<()> {
        let storage = JsonFileKeyValueStorage::new(&home_path);

        // init wallet
        let mut wallet = Wallet::new(&storage).await?;
        if !wallet.is_initialized() {
            println!("Initializing wallet...");

            self.create_aes256_guard(&mut wallet, &storage).await?;
        }
        println!("Wallet initialized");

        // init provider
        let mut provider = Provider::new(&storage).await?;
        if !provider.is_initialized() {
            println!("Initializing provider...");

            provider.load_remote().await?;
            provider.save(&storage).await?;
        }
        println!("Provider initialized");

        // init network
        println!("Initializing network...");

        let mut network = Network::new(&home_path).await?;
        if !network.is_initialized() {
            network.migrate().await?;
            network.init_data().await?;
        }
        println!("Network initialized");

        Ok(())
    }

    async fn create_aes256_guard(
        &self,
        wallet: &mut Wallet,
        storage: &JsonFileKeyValueStorage,
    ) -> Result<()> {
        let password = if let Some(password) = &self.password {
            password.clone()
        } else {
            let theme = ColorfulTheme {
                prompt_style: console::Style::new().blue().bright(),
                ..Default::default()
            };

            let password = dialoguer::Password::with_theme(&theme)
                .with_prompt("Enter your password to initialize wallet")
                .with_confirmation("Confirm your password", "Passwords do not match")
                .interact()?;

            password.to_string()
        };

        let guard = PasswordGuard::new(&mut OsRng, password.as_str())?;
        wallet.create_keys(&mut OsRng, &guard)?;

        wallet.save(storage).await?;

        Ok(())
    }
}

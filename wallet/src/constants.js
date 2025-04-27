export const PROVIDER_RPC = 'https://assets.sw.openhk.cards/dev/provider.json';

export const NETWORK_TYPE_LIST = [
  { name: 'EIP155 (Ethereum Compatible)', value: 'eip155' },
  { name: 'Solana', value: 'solana' },
  { name: 'Binance', value: 'binance' },
];

export const NETWORK_TYPE_LIST_INDEX_MAP = {
  eip155: 0,
  solana: 1,
  binance: 2,
};

export const ACCOUNT_TYPE_LIST = ['EVM', 'Solana', 'Binance'];

export const DATABASE_NAME_CONFIG_DB = 'config_db';

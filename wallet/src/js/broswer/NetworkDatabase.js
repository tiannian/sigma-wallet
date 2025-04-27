// import { openDB } from 'idb';
import { NETWORK_TYPE_LIST } from '../../constants';
import { ProviderStorage } from '../Provider';
import Dexie from 'dexie';
const NETWORK_DATABASE_NAME = 'network';
const NETWORK_DATABASE_VERSION = 1;
const NETWORK_DATABASE_STORE_NAME = 'network';

export class BrowserNetworkDatabase {
  constructor() {
    this.providerStorage = new ProviderStorage();

    this.db = new Dexie(NETWORK_DATABASE_NAME);

    this.db.version(1).stores({
      networks: '++key, name, chainId, nativeCurrency, type',
    });
  }

  async init() {}

  async loadRemote() {
    this.providerStorage.loadFromLocalStorage();

    const chainListResp = await fetch(this.providerStorage.providerInfo.chainListProvider);
    const chainList = await chainListResp.json();

    let chains = chainList.chains;

    const eip155Resp = await fetch(chainList.eip155.list);
    const eip155 = await eip155Resp.json();

    for (const chain of eip155) {
      const chainInfo = {
        key: `eip155:${chain.chainId}`,
        type: 0,
        name: chain.name,
        chainId: chain.chainId.toString(),
        currencySymbol: chain.nativeCurrency.symbol,
        rpcUrls: chain.rpc.map(rpc => rpc.url),
        selectedRpcUrl: 0,
        explorerUrls: chain.explorers.map(explorer => ({
          name: explorer.name,
          value: explorer.url,
        })),
        selectedExplorerUrl: 0,
        isTestnet: chain.slip44 === 1,
        userAdded: false,
      };

      chains.push(chainInfo);

      await this.db.networks.put(chainInfo);
    }
  }

  listNetworks(page = 1, pageSize = 20) {
    return this.db.networks
      .orderBy('chainId')
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();
  }

  getNetwork(type, chainId) {
    return this.db.networks.get(NETWORK_TYPE_LIST[type].value + ':' + chainId);
  }

  updateNetwork(network) {
    const key = NETWORK_TYPE_LIST[network.type].value + ':' + network.chainId;

    return this.db.networks.put({ ...network, key });
  }
}

export class ProviderStorage {
  constructor() {
    // 默认值
    this.providerInfo = {
      cexProxy: { url: '' },
      chainListProvider: '',
      cryptoPriceProvider: { url: '' },
      currencyRateProvider: { url: '' },
    };
    this.providerSelecter = {
      providerRpcs: [
        {
          value: 'https://assets.sw.openhk.cards/dev/provider.json',
          i18n_name: 'me.provider.provider_rpc.dev',
        },
      ],
      selectedRpcs: 0,
    };

    this.loadFromLocalStorage();
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    try {
      localStorage.setItem('providerInfo', JSON.stringify(this.providerInfo));
      localStorage.setItem('providerSelecter', JSON.stringify(this.providerSelecter));
    } catch (error) {
      console.error('Error saving provider info to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    const providerInfo = JSON.parse(localStorage.getItem('providerInfo'));
    if (providerInfo !== null) {
      this.providerInfo = providerInfo;
    }

    const providerSelecter = JSON.parse(localStorage.getItem('providerSelecter'));
    if (providerSelecter !== null) {
      this.providerSelecter = providerSelecter;
    }
  }

  async loadRemoteProvider() {
    const providerRpc = this.providerSelecter.providerRpcs[this.providerSelecter.selectedRpcs];

    if (!providerRpc) {
      throw new Error('Provider RPC not found');
    }

    const response = await fetch(providerRpc.value);
    const data = await response.json();

    this.providerInfo = data;
  }
}

export default ProviderStorage;

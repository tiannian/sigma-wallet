import { BrowserNetworkDatabase } from './broswer/NetworkDatabase';

export class Database {
  constructor() {
    if (window.__TAURI__) {
      this.networkDb = new BrowserNetworkDatabase();
    } else {
      this.networkDb = new BrowserNetworkDatabase();
    }
  }

  async init() {
    await this.networkDb.init();
  }

  networks() {
    return this.networkDb;
  }
}

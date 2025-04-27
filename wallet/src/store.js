import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PROVIDER_RPC } from './constants';
import { Database } from './js/Database';

export const useColorThemeStore = create(
  persist(
    set => ({
      currentColorTheme: 'blue',
      setColorTheme: colorTheme => set({ currentColorTheme: colorTheme }),
    }),
    {
      name: 'color-theme',
    }
  )
);

export const useTimeFormatStore = create(
  persist(
    set => ({
      currentTimeFormat: 'HH:mm:ss, MMM DD, YYYY',
      setTimeFormat: format => set({ currentTimeFormat: format }),
    }),
    {
      name: 'time-format',
    }
  )
);

export const useProviderStore = create(
  persist(
    set => ({
      currentProvider: {
        providerRPC: PROVIDER_RPC,
        cexProxy: {
          url: '',
        },
        cryptoPriceProvider: {
          url: '',
        },
        currencyRateProvider: {
          url: '',
        },
        chainListProvider: '',
      },
      setProvider: provider => set({ currentProvider: provider }),
    }),
    {
      name: 'provider',
    }
  )
);

export const useDatabase = create(set => ({
  db: null,
  initDatabase: async () => {
    const db = new Database();

    await db.init();

    await set({ db });
  },
}));

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import GroupListItem from '../components/GroupListItem';
import * as Feather from 'react-feather';
import dayjs from 'dayjs';
import Icon from '../components/Icon';
import ListItemHorizontal from '../components/list/ListItemHorizontal';
import { useColorThemeStore } from '../js/store';
const Activity = () => {
  const { t } = useTranslation();
  const topRef = useRef(null);
  const [timeFormat, setTimeFormat] = useState('HH:mm:ss, MMM DD, YYYY');
  const { currentColorTheme } = useColorThemeStore();
  useEffect(() => {
    const savedFormat = localStorage.getItem('timeFormat');
    if (savedFormat) {
      setTimeFormat(savedFormat);
    }
  }, []);

  // Sample transaction data with sub-transactions
  const transactions = [
    {
      type: t('activity.transactionTypes.multiChainSwap'),
      timestamp: 1711467840, // Unix timestamp
      transactions: [
        {
          from: 'Steve',
          to: 'Bridge',
          chain: 'Ethereum',
          amount: 1000,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
        {
          from: 'Bridge',
          to: 'DEX',
          chain: 'BSC',
          amount: 1000,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
        {
          from: 'DEX',
          to: 'Steve',
          chain: 'BSC',
          amount: 2.5,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.crossChainTransfer'),
      timestamp: 1711467720,
      transactions: [
        {
          from: 'Steve',
          to: 'Bridge',
          chain: 'Ethereum',
          amount: 0.001,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
        {
          from: 'Bridge',
          to: 'Steve',
          chain: 'BSC',
          amount: 0.001,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.tokenSwap'),
      timestamp: 1711467600,
      transactions: [
        {
          from: 'Steve',
          to: 'DEX',
          chain: 'Ethereum',
          amount: 1000,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
        {
          from: 'DEX',
          to: 'Steve',
          chain: 'Ethereum',
          amount: 0.5,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.deposit'),
      timestamp: 1711467480,
      transactions: [
        {
          from: 'Binance',
          to: 'Steve',
          chain: 'Ethereum',
          amount: 1000,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.crossChainSwap'),
      timestamp: 1711467360,
      transactions: [
        {
          from: 'Steve',
          to: 'Bridge',
          chain: 'BSC',
          amount: 5,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
        {
          from: 'Bridge',
          to: 'Steve',
          chain: 'Ethereum',
          amount: 4.98,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.tokenSwap'),
      timestamp: 1711467240,
      transactions: [
        {
          from: 'Steve',
          to: 'DEX',
          chain: 'BSC',
          amount: 2000,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
        {
          from: 'DEX',
          to: 'Steve',
          chain: 'BSC',
          amount: 5,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.withdrawal'),
      timestamp: 1711467120,
      transactions: [
        {
          from: 'Steve',
          to: 'Binance',
          chain: 'BSC',
          amount: 500,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
      ],
    },
    {
      type: t('activity.transactionTypes.multiDexSwap'),
      timestamp: 1711467000,
      transactions: [
        {
          from: 'Steve',
          to: 'DEX1',
          chain: 'Ethereum',
          amount: 2000,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
        {
          from: 'DEX1',
          to: 'DEX2',
          chain: 'Ethereum',
          amount: -1,
          token: 'ETH',
          logoUrl: '/src/assets/icons/eth.svg',
        },
        {
          from: 'DEX2',
          to: 'Steve',
          chain: 'Ethereum',
          amount: 1950,
          token: 'USDT',
          logoUrl: '/src/assets/icons/usdt.svg',
        },
      ],
    },
  ];

  const formatTimestamp = timestamp => {
    return dayjs.unix(timestamp).format(timeFormat);
  };

  return (
    <div className='overflow-hidden'>
      <div className='flex justify-between items-start'>
        <h2 ref={topRef} className='page_title'>
          {t('activity.title')}
        </h2>
        <Feather.Filter className='w-5 h-5 text-gray-600 mt-3' />
      </div>

      <div className='max-w-2xl mx-auto mb-8'>
        {transactions.map((record, index) => (
          <GroupListItem
            key={index}
            type={record.type}
            timestamp={formatTimestamp(record.timestamp)}
            render_items={() =>
              record.transactions.map((tx, idx) => {
                return (
                  <ListItemHorizontal
                    key={idx}
                    icon={<Icon url={tx.logoUrl} symbol={tx.token} />}
                    bottom={{
                      right: { text: `${tx.amount} ${tx.token}`, isTitle: true },
                      left: (
                        <div
                          className={`px-1 text-xs rounded-full bg-${currentColorTheme}-50 text-grey-500`}
                        >
                          {tx.chain}
                        </div>
                      ),
                    }}
                    top={{
                      left: `${tx.from}`,
                      middle: <Feather.ArrowRight className='w-4 h-4 text-gray-400' />,
                      right: `${tx.to}`,
                    }}
                  />
                );
              })
            }
          />
        ))}
      </div>

      {/* Scroll to top button */}
      <button
        className='fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-100 z-50'
        onClick={() => {
          if (topRef.current) {
            topRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            });
            console.log('Scrolling to top element');
          } else {
            console.log('Top element not found');
          }
        }}
      >
        <Feather.ChevronUp className='w-7 h-7' />
      </button>
    </div>
  );
};

export default Activity;

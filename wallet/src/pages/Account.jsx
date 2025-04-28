import React, { useState, useRef } from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import Icon from '../components/Icon';
import Button from '../components/Button';
import UnlabeledInput from '../components/UnlabeledInput';
import { useColorThemeStore } from '../js/store';
import PageHeader from '../components/PageHeader';
import { toast } from 'react-hot-toast';
import ListItemHorizontal from '../components/list/ListItemHorizontal';
import GroupListItem from '../components/GroupListItem';
import dayjs from 'dayjs';

// Mock data for accounts
const mockAccounts = [
  {
    id: '1',
    name: 'Ethereum Mainnet',
    type: 'EVM',
    address: '0x1234...5678',
    balance: '1.234',
    currencySymbol: 'ETH',
    logo_url: '/src/assets/icons/eth.svg',
    timestamp: '2024-03-20',
  },
  {
    id: '2',
    name: 'Binance Smart Chain',
    type: 'EVM',
    address: '0xabcd...efgh',
    balance: '100.5',
    currencySymbol: 'BNB',
    logo_url: '/src/assets/icons/bnb.svg',
    timestamp: '2024-03-20',
  },
  {
    id: '3',
    name: 'Polygon',
    type: 'EVM',
    address: '0x9876...5432',
    balance: '5000',
    currencySymbol: 'MATIC',
    logo_url: '/src/assets/icons/matic.svg',
    timestamp: '2024-03-20',
  },
  {
    id: '4',
    name: 'Arbitrum One',
    type: 'EVM',
    address: '0x2468...1357',
    balance: '0.5',
    currencySymbol: 'ETH',
    logo_url: '/src/assets/icons/arbitrum.svg',
    timestamp: '2024-03-20',
  },
  {
    id: '5',
    name: 'Optimism',
    type: 'EVM',
    address: '0x1357...2468',
    balance: '0.8',
    currencySymbol: 'ETH',
    logo_url: '/src/assets/icons/optimism.svg',
    timestamp: '2024-03-20',
  },
];

const AccountListItem = ({ account, onClick }) => {
  const { t } = useTranslation();
  const { currentColorTheme } = useColorThemeStore();

  return (
    <ListItemHorizontal
      icon={<Icon url={account.logo_url} symbol={account.name[0]} />}
      top={{
        left: account.name,
        right: `${account.balance} ${account.currencySymbol}`,
      }}
      bottom={{
        left: `${t('account.address')}: ${account.address}`,
        right: account.timestamp,
      }}
      onClick={onClick}
      className='py-2'
    />
  );
};

const Account = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const topRef = useRef(null);
  const { currentColorTheme } = useColorThemeStore();
  const [accounts] = useState(mockAccounts);

  const handleBack = () => {
    onNavigate('me');
  };

  const handleAddAccount = () => {
    // TODO: Implement add account functionality
    console.log('Add account clicked');
  };

  const filteredAccounts = accounts.filter(
    account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group accounts by type
  const groupedAccounts = filteredAccounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = [];
    }
    acc[account.type].push(account);
    return acc;
  }, {});

  return (
    <div className='p-1 overflow-hidden'>
      <div ref={topRef} />
      <PageHeader onBack={handleBack} title={t('account.title')} />

      <div className='relative mb-6 py-4'>
        <UnlabeledInput
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('account.searchPlaceholder')}
          leftIcon={<Feather.Search className='w-5 h-5' />}
        />
      </div>

      <div className='mb-4'>
        <Button fullWidth onClick={handleAddAccount}>
          <div className='flex items-center justify-center'>
            <Feather.Plus size={20} className='mr-2' />
            {t('account.addAccount')}
          </div>
        </Button>
      </div>

      <div className='bg-white rounded-lg'>
        {Object.entries(groupedAccounts).map(([type, accounts]) => (
          <GroupListItem
            key={type}
            type={type}
            timestamp={accounts[0].timestamp}
            render_items={() => (
              <>
                {accounts.map(account => (
                  <AccountListItem key={account.id} account={account} />
                ))}
              </>
            )}
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
          }
        }}
      >
        <Feather.ChevronUp className='w-7 h-7' />
      </button>
    </div>
  );
};

export default Account;

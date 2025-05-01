import React, { useState, useRef } from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import UnlabeledInput from '../../components/UnlabeledInput';
import { useColorThemeStore } from '../../js/store';
import PageHeader from '../../components/PageHeader';
import ListItemVertical from '../../components/list/ListItemViertical';
import GroupListItem from '../../components/GroupListItem';

// Mock data for accounts
const mockBlockchainAccounts = [
  {
    name: 'Account 1',
    type: 'EIP155',
    address: '0x1234...5678',
    symbol: 'E',
  },
  {
    name: 'Account 2',
    type: 'Bitcoin',
    address: '1bc......asd',
    symbol: 'B',
  },
];

const mockWiseAccounts = [
  {
    name: 'Steve Wang',
    address: '@stevewise',
    symbol: 'W',
  },
];

const mockBinanceAccounts = [
  {
    name: 'User-1001',
    address: 'example@binance.com',
    symbol: 'B',
  },
];

const mockAccounts = [
  {
    name: 'Wise',
    data: mockWiseAccounts,
  },
  {
    name: 'Blockchain',
    data: mockBlockchainAccounts,
  },
  {
    name: 'Binance',
    data: mockBinanceAccounts,
  },
];

const AccountListItem = ({ account, onClick }) => {
  const { currentColorTheme } = useColorThemeStore();

  const right = {
    top: account.type && (
      <div
        className={`px-2 py-0.5 text-sm rounded-full bg-${currentColorTheme}-100 text-${currentColorTheme}-800`}
      >
        {account.type}
      </div>
    ),
  };

  return (
    <ListItemVertical
      icon={<Icon url={account.logo_url} symbol={account.name[0]} />}
      title={account.name}
      subtitle={`${account.address}`}
      right={right}
      onClick={onClick}
    />
  );
};

const Account = ({ onNavigate, onBack }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const topRef = useRef(null);

  const handleAddAccount = () => {
    onNavigate('me/account/add');
  };

  return (
    <div className='overflow-hidden'>
      <div ref={topRef} />
      <PageHeader onBack={onBack} title={t('account.title')} />

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
        {mockAccounts.map((account, index) => (
          <GroupListItem
            key={index}
            type={account.name}
            render_items={() => (
              <>
                {account.data.map((account, index) => (
                  <AccountListItem key={index} account={account} />
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

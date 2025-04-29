import React, { useState } from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useColorThemeStore } from '../../js/store';
import { useLocation } from 'wouter';
import Icon from '../../components/Icon';
import UnlabeledInput from '../../components/UnlabeledInput';
import ListItemVertical from '../../components/list/ListItemViertical';

const Recipient = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();
  const { currentColorTheme } = useColorThemeStore();

  const contacts = [
    {
      name: 'Kraken',
      address: 'example@gmail.com',
      type: 'email',
      logo: 'https://www.kraken.com/favicon.ico',
    },
    {
      name: 'Steve Wang',
      address: '0x00000000000000000000',
      type: 'evm',
    },
    {
      name: 'Binance',
      address: '0x11111111111111111111',
      type: 'evm',
    },
  ];

  const getInitials = name => {
    const words = name.split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const formatAddress = contact => {
    return `${contact.type} : ${contact.address}`;
  };

  const handleContactClick = contact => {
    setLocation(
      `/recipient/info?name=${encodeURIComponent(
        contact.name
      )}&type=${encodeURIComponent(contact.type)}&address=${encodeURIComponent(contact.address)}`
    );
  };

  return (
    <div className='overflow-hidden'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='page_title'>{t('recipient.title', 'Recipient')}</h2>
      </div>

      {/* Search Input */}
      <div className='relative mb-6'>
        <UnlabeledInput
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder='Search or Input Recipients'
          leftIcon={<Feather.Search className='w-5 h-5' />}
          rightButtons={[
            {
              icon: <Feather.Clipboard className='w-5 h-5 text-gray-400' />,
              onClick: () => {},
            },
            {
              icon: <Feather.Maximize className='w-5 h-5 text-gray-400' />,
              onClick: () => {},
            },
          ]}
        />
      </div>

      {/* Recipients Section */}
      <div className='mb-6'>
        <h3 className='text-gray-600 mb-4'>Recipients</h3>
        <div className='flex gap-2 mb-6'>
          <button
            className={`px-4 py-1.5 text-sm rounded-full ${
              activeTab === 'all'
                ? `bg-${currentColorTheme}-500 text-white`
                : `bg-${currentColorTheme}-100 text-black`
            }`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-1.5 text-sm rounded-full ${
              activeTab === 'myself'
                ? `bg-${currentColorTheme}-500 text-white`
                : `bg-${currentColorTheme}-100 text-black`
            }`}
            onClick={() => setActiveTab('myself')}
          >
            Myself
          </button>
        </div>
      </div>

      {/* Contacts List */}
      <div className='max-w-2xl mx-auto'>
        {contacts.map((contact, index) => (
          <ListItemVertical
            key={index}
            icon={
              <Icon
                url={contact.logo}
                symbol={getInitials(contact.name)}
                className={`bg-${currentColorTheme}-100`}
              />
            }
            title={contact.name}
            subtitle={formatAddress(contact)}
            onClick={() => handleContactClick(contact)}
          />
        ))}
      </div>
    </div>
  );
};

export default Recipient;

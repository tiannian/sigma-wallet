import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/PageHeader';
import GroupListItem from '../../components/GroupListItem';
import ListItemHorizontal from '../../components/list/ListItemHorizontal';
import * as Feather from 'react-feather';
import Icon from '../../components/Icon';
import { useColorThemeStore } from '../../js/store';
import { useLocation } from 'wouter';

const AddAccount = () => {
  const { t } = useTranslation();
  const { currentColorTheme } = useColorThemeStore();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const backPath = searchParams.get('back');

  const handleBack = () => {
    if (backPath) {
      setLocation(`/${backPath}`);
    } else {
      setLocation('/me/account');
    }
  };

  const handleTypeSelect = type => {
    // TODO: Handle type selection
    console.log('Selected type:', type);
  };

  const getIconForType = key => {
    switch (key) {
      case 'mnemonics':
        return <Icon symbol={<Feather.FolderPlus className='w-5 h-5' />} />;
      case 'privateKey':
        return <Icon symbol={<Feather.Key className='w-5 h-5' />} />;
      case 'device':
        return <Icon symbol={<Feather.Smartphone className='w-5 h-5' />} />;
      case 'observer':
        return <Icon symbol={<Feather.Eye className='w-5 h-5' />} />;
      case 'binance':
        return <Icon symbol={'B'} />;
      case 'okx':
        return <Icon symbol={'O'} />;
      case 'kraken':
        return <Icon symbol={'K'} />;
      case 'wise':
        return <Icon symbol={'W'} />;
      case 'interactiveBrokers':
        return <Icon symbol={'I'} />;
    }
  };

  const accountGroups = [
    {
      type: t('account.type.blockchain.tittle'),
      items: [
        {
          key: 'mnemonics',
          label: t('account.type.blockchain.create'),
          description: t('account.type.blockchain.create.description'),
        },
        {
          key: 'privateKey',
          label: t('account.type.blockchain.import'),
          description: t('account.type.blockchain.import.description'),
        },
        {
          key: 'device',
          label: t('account.type.blockchain.device'),
          description: t('account.type.blockchain.device.description'),
        },
        {
          key: 'observer',
          label: t('account.type.blockchain.observer'),
          description: t('account.type.blockchain.observer.description'),
        },
      ],
    },
    {
      type: t('account.type.exchange.tittle'),
      items: [
        {
          key: 'binance',
          label: t('account.type.exchange.binance'),
          description: t('account.type.exchange.binance.description'),
        },
        {
          key: 'okx',
          label: t('account.type.exchange.okx'),
          description: t('account.type.exchange.okx.description'),
        },
        {
          key: 'kraken',
          label: t('account.type.exchange.kraken'),
          description: t('account.type.exchange.kraken.description'),
        },
      ],
    },
    {
      type: t('account.type.bank.tittle'),
      items: [
        {
          key: 'wise',
          label: t('account.type.bank.wise'),
          description: t('account.type.bank.wise.description'),
        },
      ],
    },
    {
      type: t('account.type.broker.tittle'),
      items: [
        {
          key: 'interactiveBrokers',
          label: t('account.type.broker.interactiveBrokers'),
          description: t('account.type.broker.interactiveBrokers.description'),
        },
      ],
    },
  ];

  return (
    <div className='overflow-hidden min-h-130'>
      <PageHeader onBack={handleBack} title={t('account.addAccount')} />

      <div className='bg-white rounded-lg py-4'>
        {accountGroups.map((group, index) => (
          <GroupListItem
            key={index}
            type={group.type}
            render_items={() => (
              <>
                {group.items.map((item, itemIndex) => (
                  <ListItemHorizontal
                    key={itemIndex}
                    icon={getIconForType(item.key)}
                    top={{
                      left: { text: item.label, isTitle: true },
                      right: (
                        <Feather.ChevronRight className={`w-5 h-5 text-${currentColorTheme}-400`} />
                      ),
                    }}
                    bottom={{
                      left: item.description,
                      right: null,
                    }}
                    onClick={() => handleTypeSelect(item.key)}
                  />
                ))}
              </>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default AddAccount;

import React, { useState, useRef, useEffect } from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import Icon from '../../components/Icon';
import Button from '../../components/Button';
import UnlabeledInput from '../../components/UnlabeledInput';
import { useColorThemeStore, useDatabase } from '../../store';
import PageHeader from '../../components/PageHeader';
import { toast } from 'react-hot-toast';
import ListItemVertical from '../../components/list/ListItemViertical';

const NetworkListItem = ({ chain, onClick }) => {
  const { t } = useTranslation();
  const { currentColorTheme } = useColorThemeStore();

  const right = {
    top: (
      <div
        className={`px-2 py-0.5 text-sm rounded-full bg-${currentColorTheme}-100 text-${currentColorTheme}-800`}
      >
        {chain.type || 'EVM'}
      </div>
    ),
    bottom: `${t('me.settings.networks.nativeToken')}: ${chain.currencySymbol}`,
  };

  return (
    <ListItemVertical
      icon={<Icon url={chain.logo_url} symbol={chain.name[0]} />}
      title={chain.name}
      subtitle={`${t('me.settings.networks.chainId')}: ${chain.chainId}`}
      right={right}
      onClick={onClick}
    />
  );
};

const Network = ({ onBack }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const topRef = useRef(null);
  const { currentColorTheme } = useColorThemeStore();
  const [, setLocation] = useLocation();
  const [chains, setChains] = useState([]);
  const { db } = useDatabase();

  useEffect(() => {
    const loadNetworks = async () => {
      if (!db) return;
      const res = await db.networkDb.listNetworks();
      setChains(res);
    };

    loadNetworks();
  }, [db]);

  const handleAddNetwork = () => {
    setLocation('/me/settings/networks/info');
  };

  const handleNetworkClick = chain => {
    const params = new URLSearchParams({
      type: chain.type,
      chainid: chain.chainId,
    });
    setLocation(`/me/settings/networks/info?${params.toString()}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await db.networkDb.loadRemote();

      const res = await db.networkDb.listNetworks();
      setChains(res);

      toast.success(t('me.settings.networks.refreshSuccess'));
    } catch (error) {
      toast.error(t('me.settings.networks.refreshError'));
      console.log('refresh error', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className='p-1 overflow-hidden'>
      <div ref={topRef} />
      <PageHeader onBack={onBack} title={t('me.settings.networks.title')} />

      <div className='relative mb-6 py-4'>
        <UnlabeledInput
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder={t('me.settings.networks.searchPlaceholder')}
          leftIcon={<Feather.Search className='w-5 h-5' />}
        />
      </div>

      <div className='mb-4'>
        <Button fullWidth onClick={handleAddNetwork}>
          <div className='flex items-center justify-center'>
            <Feather.Plus size={20} className='mr-2' />
            {t('me.settings.networks.addNetwork')}
          </div>
        </Button>
      </div>

      <div className='bg-white rounded-lg'>
        {chains.map(chain => (
          <NetworkListItem
            key={chain.type + chain.chainId}
            chain={chain}
            onClick={() => handleNetworkClick(chain)}
          />
        ))}
      </div>

      {/* Refresh and Scroll to top buttons */}
      <div className='fixed bottom-16 right-4 flex flex-col gap-4 z-50'>
        <button
          className={`w-14 h-14 rounded-full bg-${currentColorTheme}-500 text-white flex items-center justify-center shadow-lg hover:bg-${currentColorTheme}-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <Feather.RefreshCw className={`w-7 h-7 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
        <button
          className='w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-100'
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
    </div>
  );
};

export default Network;

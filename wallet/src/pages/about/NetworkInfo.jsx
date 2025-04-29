import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import LabeledInput from '../../components/LabeledInput';
import LabelSelect from '../../components/LabelSelect';
import { NETWORK_TYPE_LIST } from '../../js/constants';
import { createUrlValidator } from '../../js/checker';
import PageHeader from '../../components/PageHeader';
import { useDatabase } from '../../js/store';
const NetworkInfo = ({ onBack }) => {
  const { t } = useTranslation();
  const validateUrl = createUrlValidator(t('networkInfo.invalidUrl'));
  const { db } = useDatabase();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');
    const chainid = searchParams.get('chainid');

    if (!db) return;

    const loadNetwork = async () => {
      const network = await db.networkDb.getNetwork(type, chainid);

      setFormData(prev => ({
        ...prev,
        name: network.name,
        type: network.type,
        chainId: network.chainId,
        currencySymbol: network.currencySymbol,
        rpcUrls: network.rpcUrls.map(rpc => ({ name: rpc, value: rpc })),
        selectedRpcUrl: network.selectedRpcUrl,
        explorerUrls: network.explorerUrls,
        selectedExplorerUrl: network.selectedExplorerUrl,
      }));
    };

    if (type && chainid) {
      loadNetwork();
    }
  }, [db]);

  const [formData, setFormData] = useState({
    name: '',
    type: -1,
    chainId: '',
    currencySymbol: '',
    selectedRpcUrl: -1,
    selectedExplorerUrl: -1,
    rpcUrls: [],
    explorerUrls: [],
    isTestnet: false,
    userAdded: false,
  });

  const handleNetworkTypeChange = (value, options) => {
    setFormData(prev => ({
      ...prev,
      networkType: value,
    }));
  };

  const handleRpcUrlChange = (value, options) => {
    setFormData(prev => ({
      ...prev,
      selectedRpcUrl: value,
      rpcUrls: options,
    }));
  };

  const handleExplorerUrlChange = (value, options) => {
    setFormData(prev => ({
      ...prev,
      selectedExplorerUrl: value,
      explorerUrls: options,
    }));
  };

  const handleNameInputChange = value => {
    setFormData(prev => ({
      ...prev,
      name: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const network = {
      ...formData,
      type: formData.type,
      rpcUrls: formData.rpcUrls.map(rpc => rpc.value),
    };
    console.log('Form submitted:', network);
    await db.networkDb.updateNetwork(network);
  };

  return (
    <div className='overflow-hidden flex flex-col h-screen'>
      <PageHeader onBack={onBack} title={t('networkInfo.title')} />

      <div className='bg-white rounded-lg flex-1 flex flex-col py-4'>
        <form onSubmit={handleSubmit} className='flex flex-col h-full'>
          <div className='flex-1'>
            <LabeledInput
              label={t('networkInfo.networkName')}
              value={formData.name}
              onChange={e => handleNameInputChange('name', e.target.value)}
              placeholder={t('networkInfo.networkName')}
            />

            <LabelSelect
              label={t('networkInfo.networkType')}
              value={formData.type}
              onChange={handleNetworkTypeChange}
              options={NETWORK_TYPE_LIST}
              placeholder={t('networkInfo.selectNetworkType')}
              readOnly={true}
            />

            <LabeledInput
              label={t('networkInfo.chainId')}
              value={formData.chainId}
              onChange={e => handleInputChange('chainId', e.target.value)}
              placeholder={t('networkInfo.chainId')}
            />

            <LabeledInput
              label={t('networkInfo.currencySymbol')}
              value={formData.currencySymbol}
              onChange={e => handleInputChange('currencySymbol', e.target.value)}
              placeholder={t('networkInfo.currencySymbol')}
            />

            <LabelSelect
              label={t('networkInfo.rpcUrl')}
              value={formData.selectedRpcUrl}
              onChange={handleRpcUrlChange}
              options={formData.rpcUrls}
              placeholder={t('networkInfo.selectRpcUrl')}
              validate={validateUrl}
              addButtonText={t('networkInfo.addRpcUrl')}
            />

            <LabelSelect
              label={t('networkInfo.explorerUrl')}
              value={formData.selectedExplorerUrl}
              onChange={handleExplorerUrlChange}
              options={formData.explorerUrls}
              placeholder={t('networkInfo.selectExplorerUrl')}
              validate={validateUrl}
              addButtonText={t('networkInfo.addExplorerUrl')}
            />
          </div>
          <div className='sticky bottom-0 left-0 right-0 bg-white pt-4 pb-6'>
            <Button type='submit' fullWidth onClick={handleSubmit}>
              {t('networkInfo.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NetworkInfo;

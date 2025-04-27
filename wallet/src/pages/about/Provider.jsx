import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import LabeledInput from '../../components/LabeledInput';
import LabelSelect from '../../components/LabelSelect';
import { toast } from 'react-hot-toast';
import { createUrlValidator } from '../../utils/checker';
import PageHeader from '../../components/PageHeader';
import ProviderStorage from '../../js/Provider';

const Provider = ({ onBack }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const providerStorage = new ProviderStorage();

  const [providerSelecter, setProviderSelecter] = useState(providerStorage.providerSelecter);
  const [providerInfo, setProviderInfo] = useState(providerStorage.providerInfo);

  const urlValidator = createUrlValidator(t('provider.validation.urlFormat'));

  const isProviderValid = useMemo(() => {
    return (
      providerSelecter.selectedRpcs !== -1 &&
      urlValidator(providerSelecter.providerRpcs[providerSelecter.selectedRpcs]?.value).isValid
    );
  }, [providerSelecter]);

  const handleLoadConfiguration = async () => {
    if (!isProviderValid) return;

    setIsLoading(true);
    try {
      await providerStorage.loadRemoteProvider();

      setProviderInfo(providerStorage.providerInfo);
      setProviderInfo(prev => ({
        ...prev,
        cexProxy: {
          ...prev.cexProxy,
          url: providerStorage.providerInfo.cexProxy.url,
        },
      }));
      setProviderSelecter(providerStorage.providerSelecter);

      toast.success(t('provider.load.success'));
    } catch (error) {
      console.error(error);
      toast.error(t('provider.load.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRpcChange = (index, options) => {
    setProviderSelecter(prev => ({
      ...prev,
      selectedRpcs: index,
      providerRpcs: options,
    }));
  };

  return (
    <div className='p-1 overflow-hidden'>
      <PageHeader onBack={onBack} title={t('provider.title')} />

      <div className='bg-white rounded-lg py-4'>
        <LabelSelect
          label={t('provider.providerRPC.label')}
          value={providerSelecter.selectedRpcs}
          onChange={handleRpcChange}
          options={providerSelecter.providerRpcs.map(rpc => ({
            value: rpc.value,
            i18n_name: rpc.i18n_name,
          }))}
          placeholder={t('provider.providerRPC.placeholder')}
          addButtonText={t('provider.addRPC')}
          validate={urlValidator}
        />

        <Button
          onClick={handleLoadConfiguration}
          disabled={!isProviderValid || isLoading}
          fullWidth
          isLoading={isLoading}
        >
          {t('provider.loadConfiguration')}
        </Button>

        <div className='my-6 border-t border-gray-200'></div>

        <div className='space-y-4'>
          <LabeledInput
            label={t('provider.cexProxy.label')}
            value={providerInfo.cexProxy.url}
            onChange={value => {
              setProviderInfo(prev => ({
                ...prev,
                cexProxy: {
                  ...prev.cexProxy,
                  url: value,
                },
              }));
            }}
            placeholder={t('provider.cexProxy.placeholder')}
            validate={urlValidator}
          />

          <LabeledInput
            label={t('provider.cryptoPrice.label')}
            value={providerInfo.cryptoPriceProvider.url}
            onChange={value => {
              setProviderInfo(prev => ({
                ...prev,
                cryptoPriceProvider: {
                  ...prev.cryptoPriceProvider,
                  url: value,
                },
              }));
            }}
            placeholder={t('provider.cryptoPrice.placeholder')}
            validate={urlValidator}
          />

          <LabeledInput
            label={t('provider.currencyRate.label')}
            value={providerInfo.currencyRateProvider.url}
            onChange={value => {
              setProviderInfo(prev => ({
                ...prev,
                currencyRateProvider: {
                  ...prev.currencyRateProvider,
                  url: value,
                },
              }));
            }}
            placeholder={t('provider.currencyRate.placeholder')}
            validate={urlValidator}
          />

          <LabeledInput
            label={t('provider.chainList.label')}
            value={providerInfo.chainListProvider}
            onChange={value => {
              setProviderInfo(prev => ({
                ...prev,
                chainListProvider: value,
              }));
            }}
            placeholder={t('provider.chainList.placeholder')}
            validate={urlValidator}
          />
        </div>

        <div className='mt-6'>
          <Button
            onClick={async () => {
              providerStorage.providerInfo = providerInfo;
              await providerStorage.saveToLocalStorage();

              toast.success(t('provider.save'));
            }}
            fullWidth
          >
            {t('provider.save')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Provider;

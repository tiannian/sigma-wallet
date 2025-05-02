import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import PageHeader from '../../components/PageHeader';

const AddAccount = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className='w-full flex flex-col bg-white overflow-hidden'>
      <PageHeader onBack={() => onNavigate('welcome/password')} title={'\u00A0'} />
      <div className='w-full pt-[15vh]'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>
          {t('addAccount.title')}
        </h1>
        <p className='text-sm text-gray-600 mb-8 text-center'>{t('addAccount.subtitle')}</p>
      </div>

      <div className='p-5 py-10 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80'>
        <div className='flex flex-col gap-4 w-full'>
          <Button onClick={() => onNavigate('me/account/add?back=welcome/add-account')} fullWidth>
            {t('addAccount.addWallet')}
          </Button>

          <Button
            onClick={() => {
              onNavigate('welcome/complete');
            }}
            fullWidth
            light
            variant='outline'
          >
            {t('addAccount.skip')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;

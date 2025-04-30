import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import Button from '../../components/Button';

const AddAccount = ({ onNavigate }) => {
  const { t } = useTranslation();

  return (
    <div className='w-full flex flex-col bg-white overflow-hidden h-screen'>
      <div className='absolute top-4 left-4'>
        <button
          onClick={() => onNavigate('welcome/password')}
          className='p-2 rounded-full hover:bg-gray-100'
        >
          <Feather.ArrowLeft size={24} />
        </button>
      </div>
      <div className='w-full pt-[15vh] flex-1'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>
          {t('addAccount.title')}
        </h1>
        <p className='text-sm text-gray-600 mb-8 text-center'>{t('addAccount.subtitle')}</p>
      </div>

      <div className='p-5 py-10 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80'>
        <div className='flex flex-col gap-4 w-full'>
          <Button onClick={() => onNavigate('create')} fullWidth>
            {t('addAccount.addWallet')}
          </Button>

          <Button onClick={() => onNavigate('wallet')} fullWidth variant='outline'>
            {t('addAccount.skip')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;

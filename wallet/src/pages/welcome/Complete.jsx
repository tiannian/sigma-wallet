import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import * as Feather from 'react-feather';
import EncryptedData from '../../js/EncryptedData';
import { useLocation } from 'wouter';

const Complete = ({}) => {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();
  const encryptedData = new EncryptedData();

  const handleStart = () => {
    encryptedData.completeInit();
    setLocation('/wallet');
  };

  return (
    <div className='w-full flex flex-col bg-white overflow-hidden'>
      <div className='w-full pt-[15vh] flex-1'>
        <div className='flex flex-col items-center justify-center mb-8'>
          <Feather.CheckCircle className='h-24 w-24 text-green-500' />
        </div>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>
          {t('welcome.complete.title')}
        </h1>
        <p className='text-sm text-gray-600 mb-8 text-center'>
          {t('welcome.complete.description')}
        </p>
      </div>

      <div className='p-5 py-10 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80'>
        <Button onClick={handleStart} fullWidth>
          {t('welcome.complete.start')}
        </Button>
      </div>
    </div>
  );
};

export default Complete;

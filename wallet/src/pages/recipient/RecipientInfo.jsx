import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import Button from '../../components/Button';
import LabeledInput from '../../components/LabeledInput';
import LabelSelect from '../../components/LabelSelect';
import { ACCOUNT_TYPE_LIST } from '../../js/constants';
import { useLocation } from 'wouter';

const RecipientInfo = ({}) => {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    accountType: '',
    address: '',
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const address = searchParams.get('address');

    if (name || type || address) {
      setFormData(prev => ({
        ...prev,
        name: name || prev.name,
        accountType: type || prev.accountType,
        address: address || prev.address,
      }));
    }
  }, []);

  const handleInputChange = (name, value) => {
    if (name === 'name' && value.length > 100) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccountTypeChange = value => {
    setFormData(prev => ({
      ...prev,
      accountType: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className='overflow-hidden flex flex-col h-screen'>
      <div className='flex items-center mb-6'>
        <button onClick={() => setLocation('/recipient')} className='mr-4 p-2 rounded-full'>
          <Feather.ArrowLeft size={24} />
        </button>
        <h1 className='text-2xl font-bold'>{t('recipientInfo.title')}</h1>
      </div>

      <div className='bg-white rounded-lg flex-1 flex flex-col'>
        <form onSubmit={handleSubmit} className='flex flex-col h-full'>
          <div className='flex-1'>
            <LabeledInput
              label={t('recipientInfo.name')}
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder={t('recipientInfo.name')}
              maxLength={100}
            />

            <LabelSelect
              label={t('recipientInfo.accountType')}
              value={formData.accountType}
              onChange={handleAccountTypeChange}
              options={ACCOUNT_TYPE_LIST}
              placeholder={t('recipientInfo.selectAccountType')}
              readOnly={true}
            />

            <LabeledInput
              label={t('recipientInfo.address')}
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
              placeholder={t('recipientInfo.address')}
            />
          </div>
          <div className='sticky bottom-0 left-0 right-0 bg-white pt-4 pb-6'>
            <Button type='submit' fullWidth>
              {t('recipientInfo.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipientInfo;

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import Button from '../../components/Button';
import LabeledInput from '../../components/LabeledInput';
import PageHeader from '../../components/PageHeader';

const Password = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = value => {
    if (value.length < 8) {
      return { isValid: false, message: t('me.password.minLengthError') };
    }
    return { isValid: true, message: '' };
  };

  const handleSubmit = async () => {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return;
    }
    // TODO: Implement password verification logic
    onNavigate('account');
  };

  const handleCancel = () => {
    onNavigate('account');
  };

  return (
    <div className='w-full flex flex-col bg-white overflow-hidden'>
      <PageHeader title={'\u00A0'} />
      <div className='w-full pt-[15vh]'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>
          {t('me.password.title')}
        </h1>
        <p className='text-sm text-gray-600 mb-8 text-center'>{t('me.password.subtitle')}</p>

        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='bg-transparent border-none cursor-pointer text-gray-600 rounded hover:bg-gray-100 block float-right'
        >
          {showPassword ? <Feather.Eye size={17} /> : <Feather.EyeOff size={17} />}
        </button>

        <div className='mb-6'>
          <div className='mb-4'>
            <LabeledInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder={t('me.password.enterPassword')}
              label={t('me.password.enterPassword')}
              validate={validatePassword}
              icon={<Feather.Smile size={17} className='text-gray-600' />}
              onIconClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </div>
      </div>

      <div className='p-5 py-10 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80'>
        <div className='flex flex-col gap-4'>
          <Button onClick={handleSubmit} fullWidth>
            {t('me.password.confirm')}
          </Button>
          <Button onClick={handleCancel} light fullWidth>
            {t('me.password.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Password;

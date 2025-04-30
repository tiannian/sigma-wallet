import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import Button from '../../components/Button';
import LabeledInput from '../../components/LabeledInput';

const Password = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [useBiometric, setUseBiometric] = useState(false);
  const [understood, setUnderstood] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const validatePassword = value => {
    if (value.length < 8) {
      return { isValid: false, message: t('password.minLengthError') };
    }
    return { isValid: true, message: '' };
  };

  const validateConfirmPassword = value => {
    if (value !== password) {
      return { isValid: false, message: t('password.passwordMismatch') };
    }
    return { isValid: true, message: '' };
  };

  const handleSubmit = () => {
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword);

    if (!passwordValidation.isValid || !confirmPasswordValidation.isValid) {
      return;
    }

    // TODO: Handle password creation
    onNavigate('wallet');
  };

  return (
    <div className='min-h-screen w-full flex items-start justify-center bg-white p-5 pt-[15vh]'>
      <div className='w-full max-w-[400px]'>
        <h1 className='text-2xl font-bold text-gray-800 mb-2 text-center'>{t('password.title')}</h1>
        <p className='text-sm text-gray-600 mb-8 text-center'>{t('password.subtitle')}</p>

        <button
          type='button'
          onClick={() => setShowPasswords(!showPasswords)}
          className='bg-transparent border-none cursor-pointer text-gray-600 rounded hover:bg-gray-100 block float-right'
        >
          {showPasswords ? <Feather.Eye size={17} /> : <Feather.EyeOff size={17} />}
        </button>

        <div className='mb-6'>
          <div className='mb-4'>
            <LabeledInput
              type={showPasswords ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder={t('password.enterPassword')}
              label={t('password.enterPassword')}
              validate={validatePassword}
            />
          </div>

          <div className='mb-4'>
            <LabeledInput
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder={t('password.confirmPassword')}
              label={t('password.confirmPassword')}
              validate={validateConfirmPassword}
            />
          </div>

          <div className='text-xs text-gray-600 mb-6 text-left'>{t('password.minLength')}</div>

          <div className='mb-6'>
            <label className='flex items-center justify-between text-sm text-gray-800 cursor-pointer'>
              {t('password.useBiometricLogin')}
              <div className='relative'>
                <input
                  type='checkbox'
                  checked={useBiometric}
                  onChange={e => setUseBiometric(e.target.checked)}
                  className='sr-only'
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-300 ${useBiometric ? 'bg-blue-500' : 'bg-gray-200'}`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-transform duration-300 ${useBiometric ? 'translate-x-5' : ''}`}
                  ></div>
                </div>
              </div>
            </label>
          </div>

          <div className='mb-6 text-left'>
            <label className='flex items-start gap-2 text-sm text-gray-800'>
              <input
                type='checkbox'
                checked={understood}
                onChange={e => setUnderstood(e.target.checked)}
                className='mt-1'
              />
              <span className='leading-relaxed'>
                {t('password.understand')}
                <a href='#' className='text-blue-500 no-underline ml-1 hover:underline'>
                  {t('password.learnMore')}
                </a>
              </span>
            </label>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          fullWidth
          disabled={!password || !confirmPassword || !understood}
        >
          {t('password.create')}
        </Button>
      </div>
    </div>
  );
};

export default Password;

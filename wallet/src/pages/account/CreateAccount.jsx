import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/PageHeader';
import LabelSelect from '../../components/LabelSelect';
import { ACCOUNT_TYPES } from '../../js/constants';

const CreateAccount = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [typeState, setTypeState] = useState(0);

  const handleBack = () => {
    onNavigate('account');
  };

  return (
    <div className='overflow-hidden min-h-130'>
      <PageHeader onBack={handleBack} title={t('account.create.title')} />

      <div className='bg-white rounded-lg py-4'>
        <LabelSelect
          label={t('account.create.type.label')}
          value={typeState}
          onChange={index => setTypeState(index)}
          options={ACCOUNT_TYPES}
          placeholder={t('account.create.type.placeholder')}
          readOnly={true}
        />

        <div className='my-6 border-t border-gray-200'></div>
      </div>
    </div>
  );
};

export default CreateAccount;

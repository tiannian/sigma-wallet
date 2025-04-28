import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import { useColorThemeStore } from '../../js/store';
import ListItemVertical from '../../components/list/ListItemViertical';
import PageHeader from '../../components/PageHeader';

const Language = ({ onBack }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { currentColorTheme } = useColorThemeStore();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-HK', name: '繁體中文' },
  ];

  const handleLanguageChange = languageCode => {
    i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
  };

  return (
    <div className='p-1 overflow-hidden'>
      <PageHeader onBack={onBack} title={t('me.settings.language.title')} />

      <div className='bg-white rounded-lg'>
        {languages.map(language => (
          <ListItemVertical
            key={language.code}
            icon={<div className='w-6 h-6' />}
            title={language.name}
            subtitle={currentLanguage === language.code ? t('me.settings.language.current') : ''}
            right={
              currentLanguage === language.code ? (
                <Feather.Check className={`text-${currentColorTheme}-500`} size={20} />
              ) : null
            }
            onClick={() => handleLanguageChange(language.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default Language;

import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import { useColorThemeStore } from '../../../js/store';
import PageHeader from '../../../components/PageHeader';
import ListItemVertical from '../../../components/list/ListItemViertical';
import { useLocation } from 'wouter';

const Theme = ({}) => {
  const { t } = useTranslation();
  const [_, setLocation] = useLocation();
  const { currentColorTheme, setColorTheme } = useColorThemeStore();

  const themes = [
    { code: 'blue', name: t('me.settings.theme.blue'), color: '#3B82F6' },
    { code: 'red', name: t('me.settings.theme.red'), color: '#EF4444' },
    { code: 'green', name: t('me.settings.theme.green'), color: '#10B981' },
    { code: 'yellow', name: t('me.settings.theme.yellow'), color: '#F59E0B' },
    { code: 'purple', name: t('me.settings.theme.purple'), color: '#818CF8' },
    { code: 'pink', name: t('me.settings.theme.pink'), color: '#EC4899' },
    { code: 'orange', name: t('me.settings.theme.orange'), color: '#F97316' },
  ];

  const handleThemeChange = themeCode => {
    console.log(themeCode);
    setColorTheme(themeCode);
  };

  return (
    <div className='overflow-hidden'>
      <PageHeader onBack={() => setLocation('/me')} title={t('me.settings.theme.title')} />

      <div className='bg-white rounded-lg'>
        {themes.map(theme => (
          <ListItemVertical
            key={theme.code}
            icon={<div className='w-6 h-6 rounded-full' style={{ backgroundColor: theme.color }} />}
            title={theme.name}
            subtitle={currentColorTheme === theme.code ? t('me.settings.theme.current') : ''}
            right={
              currentColorTheme === theme.code ? (
                <Feather.Check className={`text-${currentColorTheme}-500`} size={20} />
              ) : null
            }
            onClick={() => handleThemeChange(theme.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default Theme;

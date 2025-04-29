import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Feather from 'react-feather';
import dayjs from 'dayjs';
import { useTimeFormatStore, useColorThemeStore } from '../../js/store';
import ListItemVertical from '../../components/list/ListItemViertical';
import PageHeader from '../../components/PageHeader';

const TimeFormat = ({ onBack }) => {
  const { t } = useTranslation();
  const { currentTimeFormat, setTimeFormat } = useTimeFormatStore();
  const { currentColorTheme } = useColorThemeStore();
  const [currentTime] = useState(dayjs());

  const timeFormats = [
    {
      id: 'format1',
      label: currentTime.format('HH:mm:ss, MMM DD, YYYY'),
      value: 'HH:mm:ss, MMM DD, YYYY',
    },
    {
      id: 'format2',
      label: currentTime.format('DD-MM-YYYY, HH:mm:ss'),
      value: 'DD-MM-YYYY, HH:mm:ss',
    },
    {
      id: 'format3',
      label: currentTime.format('YYYY-MM-DD, HH:mm:ss'),
      value: 'YYYY-MM-DD, HH:mm:ss',
    },
  ];

  const handleFormatSelect = format => {
    setTimeFormat(format);
  };

  return (
    <div className='overflow-hidden'>
      <PageHeader onBack={onBack} title={t('me.settings.timeFormat.title')} />

      <div className='bg-white rounded-lg'>
        {timeFormats.map(format => (
          <ListItemVertical
            key={format.id}
            icon={<div className='w-6 h-6' />}
            title={format.label}
            subtitle={currentTimeFormat === format.value ? t('me.settings.timeFormat.current') : ''}
            right={
              currentTimeFormat === format.value ? (
                <Feather.Check className={`text-${currentColorTheme}-500`} size={20} />
              ) : null
            }
            onClick={() => handleFormatSelect(format.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeFormat;

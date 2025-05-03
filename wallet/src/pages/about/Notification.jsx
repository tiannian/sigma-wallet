import React, { useRef } from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useColorThemeStore, useTimeFormatStore } from '../../js/store';
import PageHeader from '../../components/PageHeader';
import ListItemHorizontal from '../../components/list/ListItemHorizontal';
import dayjs from 'dayjs';
import { useLocation } from 'wouter';

const Notification = ({}) => {
  const { t } = useTranslation();
  const topRef = useRef(null);
  const { currentColorTheme } = useColorThemeStore();
  const { currentTimeFormat } = useTimeFormatStore();
  const [_, setLocation] = useLocation();
  // 格式化时间戳
  const formatTimestamp = timestamp => dayjs.unix(timestamp).format(currentTimeFormat);

  // Mock notification data - in real app this would come from your backend
  const notifications = [
    {
      id: 1,
      tittle: 'Transaction Completed',
      timestamp: 1714098600,
      brief: 'Your transfer of 0.1 ETH has been successfully processed',
    },
    {
      id: 2,
      tittle: 'New Token Added',
      timestamp: 1714046700,
      brief: 'USDT has been added to your wallet',
    },
    {
      id: 3,
      tittle: 'Security Alert',
      timestamp: 1713940500,
      brief: 'A new device has logged into your account',
    },
  ];

  const handleRefresh = () => {
    // TODO: Implement refresh logic
    console.log('Refreshing notifications...');
  };

  return (
    <div className='overflow-hidden'>
      <div ref={topRef} />
      <PageHeader onBack={() => setLocation('/me')} title={t('me.settings.notifications.title')} />

      <div className='bg-white rounded-lg'>
        {notifications.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>
            {t('me.settings.notifications.noNotifications')}
          </div>
        ) : (
          notifications.map(notification => (
            <ListItemHorizontal
              key={notification.id}
              icon={
                <Feather.Circle
                  size={12}
                  fill={notification.isRead ? '#D1D5DB' : `var(--color-${currentColorTheme}-500)`}
                  color={notification.isRead ? '#D1D5DB' : `var(--color-${currentColorTheme}-500)`}
                />
              }
              top={{
                left: { text: notification.tittle, isTitle: true },
                right: formatTimestamp(notification.timestamp),
              }}
              bottom={{
                left: notification.brief,
                right: '',
              }}
              onClick={() => {
                // TODO: Handle notification click
                console.log('Notification clicked:', notification.id);
              }}
            />
          ))
        )}
      </div>

      {/* Refresh and Scroll to top buttons */}
      <div className='fixed bottom-16 right-4 flex flex-col gap-4 z-50'>
        <button
          className={`w-14 h-14 rounded-full bg-${currentColorTheme}-500 text-white flex items-center justify-center shadow-lg hover:bg-${currentColorTheme}-600 transition-colors`}
          onClick={handleRefresh}
          title={t('me.settings.notifications.refresh')}
        >
          <Feather.RefreshCw className='w-7 h-7' />
        </button>
        <button
          className='w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-100'
          onClick={() => {
            if (topRef.current) {
              topRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
              });
            }
          }}
        >
          <Feather.ChevronUp className='w-7 h-7' />
        </button>
      </div>
    </div>
  );
};

export default Notification;

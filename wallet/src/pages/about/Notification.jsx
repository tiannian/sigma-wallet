import React, { useRef } from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';
import { useColorThemeStore } from '../../store';
import PageHeader from '../../components/PageHeader';
import ListItemVertical from '../../components/list/ListItemViertical';

const Notification = ({ onBack }) => {
  const { t } = useTranslation();
  const topRef = useRef(null);
  const { currentColorTheme } = useColorThemeStore();

  // Mock notification data - in real app this would come from your backend
  const notifications = [
    {
      id: 1,
      title: 'Transaction Completed',
      subtitle: 'Your transfer of 0.1 ETH has been successfully processed',
      isRead: false,
      timestamp: '2024-04-26 10:30',
    },
    {
      id: 2,
      title: 'New Token Added',
      subtitle: 'USDT has been added to your wallet',
      isRead: true,
      timestamp: '2024-04-25 15:45',
    },
    {
      id: 3,
      title: 'Security Alert',
      subtitle: 'A new device has logged into your account',
      isRead: false,
      timestamp: '2024-04-24 09:15',
    },
  ];

  const handleRefresh = () => {
    // TODO: Implement refresh logic
    console.log('Refreshing notifications...');
  };

  return (
    <div className='p-1 overflow-hidden'>
      <div ref={topRef} />
      <PageHeader onBack={onBack} title={t('me.settings.notifications.title')} />

      <div className='bg-white rounded-lg'>
        {notifications.length === 0 ? (
          <div className='p-4 text-center text-gray-500'>
            {t('me.settings.notifications.noNotifications')}
          </div>
        ) : (
          notifications.map(notification => (
            <ListItemVertical
              key={notification.id}
              icon={
                <Feather.Circle
                  size={12}
                  fill={notification.isRead ? '#D1D5DB' : `var(--color-${currentColorTheme}-500)`}
                  color={notification.isRead ? '#D1D5DB' : `var(--color-${currentColorTheme}-500)`}
                />
              }
              title={notification.title}
              subtitle={notification.subtitle}
              right={{ top: notification.timestamp }}
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

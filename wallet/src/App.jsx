import { useTranslation } from 'react-i18next';
import { Route, Switch, useLocation } from 'wouter';
import Nav from './components/Nav';
import * as Icon from 'react-feather';
import './App.css';
import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import './i18n/i18n';
import { useDatabase } from './js/store';
import { useEffect } from 'react';
import ProviderStorage from './js/Provider';
import { BrowserNetworkDatabase } from './js/broswer/NetworkDatabase';
import EncryptedData from './js/EncryptedData';
import { useBlockBack } from './js/utils/BlockBack';
import SwipeableContainer from './components/SwipeableContainer';
// Lazy load all page components
const Wallet = lazy(() => import('./pages/Wallet'));
const Activity = lazy(() => import('./pages/Activity'));
const Recipient = lazy(() => import('./pages/recipient/Recipient'));
const RecipientInfo = lazy(() => import('./pages/recipient/RecipientInfo'));
const Me = lazy(() => import('./pages/about/Me'));
const Language = lazy(() => import('./pages/about/settings/Language'));
const TimeFormat = lazy(() => import('./pages/about/settings/TimeFormat'));
const Theme = lazy(() => import('./pages/about/settings/Theme'));
const Provider = lazy(() => import('./pages/about/settings/Provider'));
const Network = lazy(() => import('./pages/about/settings/Network'));
const NetworkInfo = lazy(() => import('./pages/about/settings/NetworkInfo'));
const Notification = lazy(() => import('./pages/about/Notification'));
const Account = lazy(() => import('./pages/account/Account'));
const AddAccount = lazy(() => import('./pages/account/AddAccount'));
const AccountPassword = lazy(() => import('./pages/account/Password'));
const Welcome = lazy(() => import('./pages/welcome/Welcome'));
const Password = lazy(() => import('./pages/welcome/Password'));
const AddAccountWelcome = lazy(() => import('./pages/welcome/AddAccount'));
const Complete = lazy(() => import('./pages/welcome/Complete'));

// Loading component
const Loading = () => (
  <div className='flex items-center justify-center h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
  </div>
);

const navigationItems = [
  {
    id: 'wallet',
    icon: <Icon.CreditCard size={24} />,
    label: 'nav.wallet',
  },
  {
    id: 'activity',
    icon: <Icon.Activity size={24} />,
    label: 'nav.activity',
  },
  {
    id: 'recipient',
    icon: <Icon.Send size={20} />,
    label: 'nav.transfer',
  },
  {
    id: 'me',
    icon: <Icon.User size={24} />,
    label: 'nav.me',
  },
];

function App() {
  const [location, setLocation] = useLocation();
  const { initDatabase } = useDatabase();

  useLayoutEffect(() => {
    const encryptedData = new EncryptedData();
    if (!encryptedData.isInitialized()) {
      setLocation('/welcome');
    }
  }, [setLocation]);

  useEffect(() => {
    initDatabase();
    new ProviderStorage();
    new BrowserNetworkDatabase().init();
  }, [initDatabase]);

  const handleNavigate = page => {
    setLocation(`/${page}`);
  };

  const currentPage = location.split('/')[1] || 'wallet';

  useBlockBack(['/welcome', '/wallet', '/activity', '/recipient', '/me']);

  return (
    <SwipeableContainer>
      <div className='flex flex-col h-screen padding-ios'>
        <div className='flex-1 overflow-auto'>
          <div className='max-w-2xl mx-auto p-5'>
            <Suspense fallback={<Loading />}>
              <Switch>
                <Route path='/wallet' component={Wallet} />
                <Route path='/welcome' component={Welcome} />
                <Route path='/welcome/password' component={Password} />
                <Route path='/welcome/add-account' component={AddAccountWelcome} />
                <Route path='/welcome/complete' component={Complete} />
                <Route path='/activity' component={Activity} />
                <Route path='/recipient' component={Recipient} />
                <Route path='/recipient/info' component={RecipientInfo} />
                <Route path='/me' component={Me} />
                <Route path='/me/notifications' component={Notification} />
                <Route path='/me/settings/language' component={Language} />
                <Route path='/me/settings/timeFormat' component={TimeFormat} />
                <Route path='/me/settings/theme' component={Theme} />
                <Route path='/me/settings/provider' component={Provider} />
                <Route path='/me/settings/networks' component={Network} />
                <Route path='/me/settings/networks/info' component={NetworkInfo} />
                <Route path='/me/account' component={Account} />
                <Route path='/me/account/add' component={AddAccount} />
                <Route path='/me/account/password' component={AccountPassword} />
                <Route component={Wallet} />
              </Switch>
            </Suspense>
          </div>
        </div>
        {!location.startsWith('/me/settings') &&
          !location.startsWith('/recipient/info') &&
          !location.startsWith('/me/notifications') &&
          !location.startsWith('/me/account') &&
          !location.startsWith('/welcome') && (
            <Nav items={navigationItems} activeTab={currentPage} onTabChange={handleNavigate} />
          )}
        <Toaster position='bottom-center' />
      </div>
    </SwipeableContainer>
  );
}

export default App;

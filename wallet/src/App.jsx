import { useTranslation } from 'react-i18next';
import { Route, Switch, useLocation } from 'wouter';
import Nav from './components/Nav';
import * as Icon from 'react-feather';
import './App.css';
import Wallet from './pages/Wallet';
import Activity from './pages/Activity';
import Recipient from './pages/recipient/Recipient';
import RecipientInfo from './pages/recipient/RecipientInfo';
import Me from './pages/about/Me';
import Language from './pages/about/Language';
import TimeFormat from './pages/about/TimeFormat';
import Theme from './pages/about/Theme';
import Provider from './pages/about/Provider';
import Network from './pages/about/Network';
import NetworkInfo from './pages/about/NetworkInfo';
import Notification from './pages/about/Notification';
import Account from './pages/account/Account';
import { Toaster } from 'react-hot-toast';
import './i18n/i18n';
import { useDatabase } from './js/store';
import { useEffect } from 'react';
import ProviderStorage from './js/Provider';
import { BrowserNetworkDatabase } from './js/broswer/NetworkDatabase';
function App() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const { initDatabase } = useDatabase();

  useEffect(() => {
    initDatabase();
    new ProviderStorage();
    new BrowserNetworkDatabase().init();
  }, [initDatabase]);

  const navigationItems = [
    {
      id: 'wallet',
      icon: <Icon.CreditCard size={24} />,
      label: t('nav.wallet'),
    },
    {
      id: 'activity',
      icon: <Icon.Activity size={24} />,
      label: t('nav.activity'),
    },
    {
      id: 'recipient',
      icon: <Icon.Send size={20} />,
      label: t('nav.transfer'),
    },
    {
      id: 'me',
      icon: <Icon.User size={24} />,
      label: t('nav.me'),
    },
  ];

  const handleNavigate = page => {
    setLocation(`/${page}`);
  };

  const currentPage = location.split('/')[1] || 'wallet';

  return (
    <div className='flex flex-col h-screen padding-ios'>
      <div className='flex-1 overflow-auto'>
        <div className='max-w-2xl mx-auto p-4'>
          <Switch>
            <Route path='/wallet' component={Wallet} />
            <Route path='/activity' component={Activity} />
            <Route path='/recipient' component={Recipient} />
            <Route
              path='/recipient/info'
              component={() => <RecipientInfo onBack={() => setLocation('/recipient')} />}
            />
            <Route path='/me' component={() => <Me onNavigate={handleNavigate} />} />
            <Route
              path='/me/notifications'
              component={() => <Notification onBack={() => setLocation('/me')} />}
            />
            <Route
              path='/me/settings/language'
              component={() => <Language onBack={() => setLocation('/me')} />}
            />
            <Route
              path='/me/settings/timeFormat'
              component={() => <TimeFormat onBack={() => setLocation('/me')} />}
            />
            <Route
              path='/me/settings/theme'
              component={() => <Theme onBack={() => setLocation('/me')} />}
            />
            <Route
              path='/me/settings/provider'
              component={() => <Provider onBack={() => setLocation('/me')} />}
            />
            <Route
              path='/me/settings/networks'
              component={() => <Network onBack={() => setLocation('/me')} />}
            />
            <Route
              path='/me/settings/networks/info'
              component={({ params }) => (
                <NetworkInfo onBack={() => setLocation('/me/settings/networks')} />
              )}
            />
            <Route path='/account' component={() => <Account onNavigate={handleNavigate} />} />
            <Route component={Wallet} />
          </Switch>
        </div>
      </div>
      {!location.startsWith('/me/settings/language') &&
        !location.startsWith('/me/settings/timeFormat') &&
        !location.startsWith('/me/settings/theme') &&
        !location.startsWith('/me/settings/provider') &&
        !location.startsWith('/me/settings/networks') &&
        !location.startsWith('/recipient/info') &&
        !location.startsWith('/me/notifications') && (
          <Nav items={navigationItems} activeTab={currentPage} onTabChange={handleNavigate} />
        )}
      <Toaster position='bottom-center' />
    </div>
  );
}

export default App;

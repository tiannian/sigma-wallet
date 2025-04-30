import React from 'react';
import { useTranslation } from 'react-i18next';
import SectionList from '../../components/SectionList';
import Icon from '../../components/Icon';
import * as Feather from 'react-feather';

import { toast } from 'react-hot-toast';

const Me = ({ onNavigate }) => {
  const { t } = useTranslation();

  const accountSection = {
    title: t('me.account.title'),
    items: [
      {
        icon: <Icon symbol={<Feather.User className='w-6 h-6' />} />,
        title: t('me.account.accounts.title'),
        subtitle: t('me.account.accounts.subtitle'),
        onClick: () => onNavigate('me/account'),
      },
      {
        icon: <Icon symbol={<Feather.Bell className='w-6 h-6' />} />,
        title: t('me.account.notifications.title'),
        subtitle: t('me.account.notifications.subtitle'),
        onClick: () => onNavigate('me/notifications'),
      },
      {
        icon: <Icon symbol={<Feather.Link className='w-6 h-6' />} />,
        title: t('me.account.walletConnect.title'),
        subtitle: t('me.account.walletConnect.subtitle'),
        onClick: () => console.log('Wallet Connect Session clicked'),
      },
    ],
  };

  const settingsSection = {
    title: t('me.settings.title'),
    items: [
      {
        icon: <Icon symbol={<Feather.Shield className='w-6 h-6' />} />,
        title: t('me.settings.security.title'),
        subtitle: t('me.settings.security.subtitle'),
        onClick: () => toast.error('Security clicked'),
      },
      {
        icon: <Icon symbol={<Feather.Server className='w-6 h-6' />} />,
        title: t('me.settings.serviceProvider.title'),
        subtitle: t('me.settings.serviceProvider.subtitle'),
        onClick: () => onNavigate('me/settings/provider'),
      },
      {
        icon: <Icon symbol={<Feather.GitBranch className='w-6 h-6' />} />,
        title: t('me.settings.networks.title'),
        subtitle: t('me.settings.networks.subtitle'),
        onClick: () => onNavigate('me/settings/networks'),
      },
      {
        icon: <Icon symbol={<Feather.Globe className='w-6 h-6' />} />,
        title: t('me.settings.language.title'),
        subtitle: t('me.settings.language.subtitle'),
        onClick: () => onNavigate('me/settings/language'),
      },
      {
        icon: <Icon symbol={<Feather.Clock className='w-6 h-6' />} />,
        title: t('me.settings.timeFormat.title'),
        subtitle: t('me.settings.timeFormat.subtitle'),
        onClick: () => onNavigate('me/settings/timeFormat'),
      },
      {
        icon: <Icon symbol={<Feather.Moon className='w-6 h-6' />} />,
        title: t('me.settings.theme.title'),
        subtitle: t('me.settings.theme.subtitle'),
        onClick: () => onNavigate('me/settings/theme'),
      },
    ],
  };

  const aboutSection = {
    title: t('me.about.title'),
    items: [
      {
        icon: <Icon symbol={<Feather.Info className='w-6 h-6' />} />,
        title: t('me.about.version.title'),
        subtitle: t('me.about.version.subtitle'),
        onClick: () => console.log('Version clicked'),
      },
      {
        icon: <Icon symbol={<Feather.Heart className='w-6 h-6' />} />,
        title: t('me.about.donate.title'),
        subtitle: t('me.about.donate.subtitle'),
        onClick: () => console.log('Donate clicked'),
      },
      {
        icon: <Icon symbol={<Feather.MessageCircle className='w-6 h-6' />} />,
        title: t('me.about.discord.title'),
        subtitle: t('me.about.discord.subtitle'),
        onClick: () => console.log('Discord clicked'),
      },
      {
        icon: <Icon symbol={<Feather.GitHub className='w-6 h-6' />} />,
        title: t('me.about.github.title'),
        subtitle: t('me.about.github.subtitle'),
        onClick: () => console.log('Github clicked'),
      },
      {
        icon: <Icon symbol={<Feather.FileText className='w-6 h-6' />} />,
        title: t('me.about.terms.title'),
        subtitle: t('me.about.terms.subtitle'),
        onClick: () => console.log('Term of Use clicked'),
      },
    ],
  };

  return (
    <div className='overflow-hidden'>
      <SectionList {...accountSection} />
      <SectionList {...settingsSection} />
      <SectionList {...aboutSection} />
    </div>
  );
};

export default Me;

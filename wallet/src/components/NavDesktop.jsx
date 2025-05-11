import React from 'react';
import PropTypes from 'prop-types';
import { useColorThemeStore } from '../js/store';
import { useTranslation } from 'react-i18next';

const NavDesktopItem = ({ icon, label, isActive, onClick, activeColor }) => (
  <div
    className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
      isActive ? `bg-${activeColor}-500 text-white` : 'text-gray-800 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <div className='mr-2 flex-1/5'>{icon}</div>
    <span className='flex-4/5 text-sm font-medium'>{label}</span>
  </div>
);

NavDesktopItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  activeColor: PropTypes.string.isRequired,
};

const NavDesktop = ({ items, activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { currentColorTheme } = useColorThemeStore();

  return (
    <div className='ml-auto w-64 h-full border-r border-gray-200 bg-white'>
      <div className='flex flex-col space-y-2 p-4 pt-50'>
        {items.map(item => (
          <NavDesktopItem
            key={item.id}
            icon={item.icon}
            label={t(item.label)}
            isActive={activeTab === item.id}
            onClick={() => onTabChange(item.id)}
            activeColor={currentColorTheme}
          />
        ))}
      </div>
    </div>
  );
};

NavDesktop.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default NavDesktop;

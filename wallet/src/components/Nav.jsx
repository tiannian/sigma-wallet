import React from 'react';
import PropTypes from 'prop-types';
import { useColorThemeStore } from '../js/store';
import { useTranslation } from 'react-i18next';
const NavItem = ({ icon, label, isActive, onClick, activeColor }) => (
  <div
    className={`flex flex-col items-center justify-center flex-1 py-2 cursor-pointer ${
      isActive ? `text-${activeColor}-500` : 'text-gray-600'
    }`}
    onClick={onClick}
  >
    {icon}
    <span className='text-xs mt-1'>{label}</span>
  </div>
);

NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  activeColor: PropTypes.string.isRequired,
};

const Nav = ({ items, activeTab, onTabChange }) => {
  const { t } = useTranslation();
  const { currentColorTheme } = useColorThemeStore();

  return (
    <div className='flex items-center justify-around border-t border-gray-200 bg-white'>
      {items.map(item => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={t(item.label)}
          isActive={activeTab === item.id}
          onClick={() => onTabChange(item.id)}
          activeColor={currentColorTheme}
        />
      ))}
    </div>
  );
};

Nav.propTypes = {
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

export default Nav;

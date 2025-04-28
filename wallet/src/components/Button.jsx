import React from 'react';
import PropTypes from 'prop-types';
import { useColorThemeStore } from '../js/store';
import * as Feather from 'react-feather';

const Button = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  isLoading = false,
}) => {
  const { currentColorTheme } = useColorThemeStore();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        py-3 px-4 
        rounded-full 
        font-medium 
        transition-colors
        ${fullWidth ? 'w-full' : ''}
        ${
          disabled
            ? `bg-${currentColorTheme}-200 opacity-75 text-gray-500 cursor-not-allowed`
            : `bg-${currentColorTheme}-500 hover:bg-${currentColorTheme}-600 text-white`
        }
        ${className}
      `}
    >
      <div className='flex items-center justify-center gap-2'>
        {isLoading && <Feather.RefreshCw className='w-4 h-4 animate-spin' />}
        {children}
      </div>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  isLoading: PropTypes.bool,
};

export default Button;

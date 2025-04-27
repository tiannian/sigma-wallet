import React from 'react';
import PropTypes from 'prop-types';

const UnlabeledInput = ({
  value,
  onChange,
  placeholder,
  leftIcon,
  rightButtons = [],
  className = '',
  inputClassName = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {leftIcon && <div className='absolute left-4 w-5 h-5 text-gray-400'>{leftIcon}</div>}
      <input
        type='text'
        placeholder={placeholder}
        className={`w-full pl-12 pr-24 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 ${inputClassName}`}
        value={value}
        onChange={onChange}
      />
      <div className='absolute right-0 flex items-center space-x-2 pr-4'>
        {rightButtons.map((button, index) => (
          <button
            key={index}
            className='p-1 hover:bg-gray-100 rounded-full transition-colors'
            onClick={button.onClick}
          >
            {button.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

UnlabeledInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  leftIcon: PropTypes.node,
  rightButtons: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      onClick: PropTypes.func,
    })
  ),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default UnlabeledInput;

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LabeledInput = ({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  inputClassName = '',
  validate = () => ({ isValid: true, message: '' }),
  type = 'text',
  icon,
  onIconClick,
}) => {
  const [error, setError] = useState('');

  const handleChange = e => {
    const validation = validate(e.target.value);
    setError(validation.isValid ? '' : validation.message);
    onChange(e.target.value);
  };

  return (
    <div className={`mb-6 ${className}`}>
      {label && <label className='block text-sm text-gray-600 mb-2'>{label}</label>}
      <div className='relative flex items-center'>
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            w-full 
            pl-4 pr-12 
            py-3 
            rounded-full 
            border 
            focus:outline-none 
            ${
              error !== ''
                ? 'border-red-500 focus:border-red-500'
                : 'border-gray-200 focus:border-blue-500'
            }
            ${inputClassName}
          `}
        />
        {icon && (
          <button
            type='button'
            onClick={onIconClick}
            className='absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors'
          >
            {icon}
          </button>
        )}
      </div>
      {error && <p className='mt-1 text-sm text-red-500'>{error}</p>}
    </div>
  );
};

LabeledInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  validate: PropTypes.func,
  type: PropTypes.string,
  icon: PropTypes.node,
  onIconClick: PropTypes.func,
};

export default LabeledInput;

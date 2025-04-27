import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import LabeledInput from './LabeledInput';

const AddOptionForm = ({ onAdd, onClear, validate }) => {
  const [newOption, setNewOption] = useState({ name: '', value: '' });
  const [error, setError] = useState('');

  const handleNameChange = e => {
    const value = e.target.value;
    setNewOption(prev => ({
      ...prev,
      name: value,
    }));
  };

  const handleValueChange = e => {
    const value = e.target.value;
    const validation = validate(value);
    setError(validation.isValid ? '' : validation.message);
    setNewOption(prev => ({
      ...prev,
      value: value,
    }));
  };

  const handleAddOption = () => {
    if (newOption.name.trim() && newOption.value !== '') {
      const validation = validate(newOption.value);
      if (validation.isValid) {
        onAdd(newOption);
        setNewOption({ name: '', value: '' });
        setError('');
      }
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex flex-col gap-1'>
        <LabeledInput
          value={newOption.name}
          onChange={handleNameChange}
          placeholder='Enter option name'
          inputClassName='mb-0'
        />
        <LabeledInput
          value={newOption.value}
          onChange={handleValueChange}
          placeholder='Enter option value'
          error={error}
          validate={validate}
          inputClassName='mb-0'
        />
      </div>
      <div className='flex gap-2'>
        <Button onClick={onClear} className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700'>
          Clear
        </Button>
        <Button onClick={handleAddOption} className='flex-1'>
          Confirm
        </Button>
      </div>
    </div>
  );
};

AddOptionForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
};

export default AddOptionForm;

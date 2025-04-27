import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Plus, Trash2 } from 'react-feather';
import Button from './Button';
import AddOptionForm from './AddOptionForm';
import { useTranslation } from 'react-i18next';
const LabelSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className = '',
  selectClassName = '',
  readOnly = false,
  validate = () => ({ isValid: true, message: '' }),
  addButtonText = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsAdding(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAddOption = newOption => {
    options.push({ name: newOption.name.trim(), value: newOption.value });
    onChange(options.length - 1, options);
    setIsAdding(false);
  };

  const handleClear = () => {
    setIsAdding(false);
  };

  const handleDeleteOption = index => {
    options.splice(index, 1);
    if (value === index) {
      onChange(-1, options);
    } else {
      onChange(value, options);
    }
  };

  const handleOptionClick = index => {
    onChange(index, options);
    setIsOpen(false);
  };

  return (
    <div className={`relative mb-6 ${className}`}>
      <label className='block text-sm text-gray-600 mb-2'>{label}</label>
      <div className='relative' ref={dropdownRef}>
        <div
          className={`w-full pl-5 pr-24 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer ${selectClassName}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {options[value]?.name || t(options[value]?.i18n_name) || placeholder}
        </div>
        <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
          <ChevronDown className='w-5 h-5 text-gray-400' />
        </div>

        {isOpen && (
          <div className='absolute w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50'>
            {!readOnly && (
              <div className='p-2 border-b border-gray-200 sticky top-0 bg-white z-10'>
                {!isAdding ? (
                  <Button onClick={() => setIsAdding(true)} className='w-full'>
                    <Plus size={16} />
                    <span>{addButtonText}</span>
                  </Button>
                ) : (
                  <AddOptionForm
                    onAdd={handleAddOption}
                    onClear={handleClear}
                    validate={validate}
                  />
                )}
              </div>
            )}
            {!isAdding && (
              <div className='py-2'>
                {options.map((option, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer'
                    onClick={() => handleOptionClick(index)}
                  >
                    <span className={value === index ? 'text-blue-500' : ''}>
                      {t(option.i18n_name) || option.name}
                    </span>
                    {!readOnly && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDeleteOption(index);
                        }}
                        className='p-1 text-gray-400 hover:text-red-500'
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

LabelSelect.propTypes = {
  /** 标签文本 */
  label: PropTypes.string.isRequired,
  /** 当前选中的值的索引 */
  value: PropTypes.number,
  /** 值变化时的回调函数，接收两个参数：选中的索引和新的选项列表 */
  onChange: PropTypes.func.isRequired,
  /** 选项列表，每个选项包含 name 和 value 属性 */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string.isRequired,
      i18n_name: PropTypes.string,
    })
  ).isRequired,
  /** 占位文本 */
  placeholder: PropTypes.string,
  /** 外层容器自定义样式类名 */
  className: PropTypes.string,
  /** 选择框自定义样式类名 */
  selectClassName: PropTypes.string,
  /** 是否只读，只读模式下不能添加新选项 */
  readOnly: PropTypes.bool,
  /** 验证函数，用于验证新添加的选项，返回 { isValid: boolean, message: string } */
  validate: PropTypes.func,
  /** 添加按钮的文本 */
  addButtonText: PropTypes.string,
};

export default LabelSelect;

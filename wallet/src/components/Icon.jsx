import React from 'react';
import PropTypes from 'prop-types';
import { useColorThemeStore } from '../store';

const Icon = ({ url, symbol, className = '', showBackground = true }) => {
  const { currentColorTheme } = useColorThemeStore();
  const backgroundClass = showBackground ? `bg-${currentColorTheme}-100 rounded-full` : '';

  if (url) {
    return (
      <div
        className={`w-12 h-12 flex items-center justify-center overflow-hidden ${backgroundClass} ${className}`}
      >
        <img
          src={url}
          alt={typeof symbol === 'string' ? symbol : ''}
          className='w-full h-full object-contain max-w-full max-h-full'
        />
      </div>
    );
  }

  return (
    <div className={`w-12 h-12 flex items-center justify-center ${backgroundClass} ${className}`}>
      {typeof symbol === 'string' ? <span className='text-xl font-medium'>{symbol}</span> : symbol}
    </div>
  );
};

Icon.propTypes = {
  /** 图标URL */
  url: PropTypes.string,
  /** 图标文字或React元素，当没有url时显示 */
  symbol: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  /** 自定义样式类名 */
  className: PropTypes.string,
  /** 是否显示背景色 */
  showBackground: PropTypes.bool,
};

export default Icon;

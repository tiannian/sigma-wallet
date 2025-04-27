import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';

const SectionList = ({ title, items, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      {title && <h2 className='page_title'>{title}</h2>}
      <div className='flex flex-col'>
        {items.map((item, index) => (
          <ListItem
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            right={item.right}
            onClick={item.onClick}
            className='border-b border-gray-100 last:border-b-0'
          />
        ))}
      </div>
    </div>
  );
};

SectionList.propTypes = {
  /** 列表标题 */
  title: PropTypes.string,
  /** 列表项数组 */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** 图标组件 */
      icon: PropTypes.node,
      /** 标题文本 */
      title: PropTypes.string.isRequired,
      /** 副标题文本 */
      subtitle: PropTypes.string,
      /** 右侧内容，可以是对象 {top, bottom} 或 JSX 元素 */
      right: PropTypes.oneOfType([
        PropTypes.shape({
          top: PropTypes.node,
          bottom: PropTypes.node,
        }),
        PropTypes.element,
      ]),
      /** 点击事件处理函数 */
      onClick: PropTypes.func,
    })
  ).isRequired,
  /** 自定义样式类名 */
  className: PropTypes.string,
};

export default SectionList;

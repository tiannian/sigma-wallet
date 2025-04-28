import React from 'react';
import ListItemVertical from './list/ListItemViertical';

const GroupListItem = ({ type, timestamp, items }) => {
  return (
    <div className='flex flex-col py-2'>
      {/* Header - Type and Timestamp */}
      <div className='flex justify-between items-center mb-2'>
        <span className='list_item_title'>{type}</span>
        <span className='list_item_comment'>{timestamp}</span>
      </div>

      {/* Items */}
      <div className='flex flex-col divide-y divide-gray-100'>
        {items.map((item, index) => (
          <ListItemVertical
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            right={item.right}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupListItem;

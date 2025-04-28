import React from 'react';

const GroupListItem = ({ type, timestamp, render_items }) => {
  return (
    <div className='flex flex-col py-2'>
      {/* Header - Type and Timestamp */}
      <div className='flex justify-between items-center mb-2'>
        <span className='list_item_title'>{type}</span>
        <span className='list_item_comment'>{timestamp}</span>
      </div>

      {/* Items */}
      <div className='flex flex-col divide-y divide-gray-100'>{render_items?.()}</div>
    </div>
  );
};

export default GroupListItem;

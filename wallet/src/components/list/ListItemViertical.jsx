import React from 'react';

const ListItemVertical = ({ icon, title, subtitle, right, onClick, className = '' }) => {
  const renderRight = () => {
    if (!right) return null;

    if (React.isValidElement(right)) {
      return <div className='flex items-center justify-end'>{right}</div>;
    }

    return (
      <div className='flex flex-col items-end justify-start'>
        {right.top && <div className={right.bottom ? 'mb-1' : ''}>{right.top}</div>}
        {right.bottom && <div className='text-sm text-gray-500'>{right.bottom}</div>}
      </div>
    );
  };

  return (
    <div
      className={`flex items-center h-20 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${className}`}
      onClick={onClick}
    >
      <div className='mr-4'>{icon}</div>
      <div className='flex-1'>
        <div className='text-lg font-medium text-gray-900'>{title}</div>
        <div className='text-sm text-gray-500'>{subtitle}</div>
      </div>
      {renderRight()}
    </div>
  );
};

export default ListItemVertical;

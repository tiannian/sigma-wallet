import React from 'react';

const ListItemHorizontal = ({ icon, top, bottom, onClick, className = '' }) => {
  const renderText = item => {
    if (!item) return null;
    if (React.isValidElement(item)) {
      return item;
    }
    if (typeof item === 'object') {
      const className = item.isTitle
        ? 'text-base font-medium text-gray-900'
        : 'text-sm text-gray-500';
      return <div className={className}>{item.text}</div>;
    }
    return <div className='text-sm text-gray-500'>{item}</div>;
  };

  const renderTop = section => {
    if (!section) return null;
    if (React.isValidElement(section)) {
      return section;
    }
    return (
      <div className='flex items-center justify-between w-full'>
        {renderText(section.left)}
        {renderText(section.right)}
      </div>
    );
  };

  const renderBottom = section => {
    if (!section) return null;
    if (React.isValidElement(section)) {
      return section;
    }
    return (
      <div className='flex items-center justify-between w-full relative'>
        {renderText(section.left)}
        {section.middle && (
          <div className='absolute left-1/2 -translate-x-1/2 flex items-center justify-center'>
            {section.middle}
          </div>
        )}
        {renderText(section.right)}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-row items-center min-h-20 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${className}`}
      onClick={onClick}
    >
      <div className='mr-3'>{icon}</div>
      <div className='flex flex-col flex-1 justify-center'>
        {renderTop(top)}
        {renderBottom(bottom)}
      </div>
    </div>
  );
};

export default ListItemHorizontal;

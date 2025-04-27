import React from 'react';
import * as Feather from 'react-feather';

const PageHeader = ({ onBack, title }) => {
  return (
    <div className='flex items-center'>
      <button onClick={onBack} className='mr-4 rounded-full  mb-2'>
        <Feather.ArrowLeft size={24} />
      </button>
      <h2 className='page_title'>{title}</h2>
    </div>
  );
};

export default PageHeader;

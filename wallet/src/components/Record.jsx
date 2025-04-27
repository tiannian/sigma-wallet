import React from 'react';
import { useTranslation } from 'react-i18next';
import { useColorThemeStore } from '../store';

const SubTransaction = ({ from, to, chain, amount, token }) => {
  const { t } = useTranslation();
  const { currentColorTheme } = useColorThemeStore();

  return (
    <div className='flex items-center justify-between py-3'>
      {/* Token Icon */}
      <div
        className={`w-12 h-12 rounded-full bg-${currentColorTheme}-100 flex items-center justify-center mr-4`}
      >
        <img
          src={`/src/assets/icons/${token.toLowerCase()}.svg`}
          alt={token}
          className='w-full h-full'
        />
      </div>

      {/* Transaction Details */}
      <div className='flex-1'>
        <div className='flex flex-col'>
          <span className='list_item_description'>
            {t('activity.transaction.from')}: {from}
          </span>
          <span className='list_item_description'>
            {t('activity.transaction.to')}: {to}
          </span>
        </div>
      </div>

      {/* Chain and Amount */}
      <div className='flex flex-col items-end'>
        <span className='list_item_body'>
          {amount < 0 ? '- ' : '+ '}
          {Math.abs(amount)} {token}
        </span>
        <span className='list_item_comment'>{chain}</span>
      </div>
    </div>
  );
};

const Record = ({ type, timestamp, transactions }) => {
  return (
    <div className='flex flex-col py-2'>
      {/* Header - Type and Timestamp */}
      <div className='flex justify-between items-center mb-2'>
        <span className='list_item_title'>{type}</span>
        <span className='list_item_comment'>{timestamp}</span>
      </div>

      {/* Sub-transactions */}
      <div className='flex flex-col divide-y divide-gray-100'>
        {transactions.map((tx, index) => (
          <SubTransaction
            key={index}
            from={tx.from}
            to={tx.to}
            chain={tx.chain}
            amount={tx.amount}
            token={tx.token}
          />
        ))}
      </div>
    </div>
  );
};

export default Record;

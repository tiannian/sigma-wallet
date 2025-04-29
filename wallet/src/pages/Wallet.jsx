import React, { useState } from 'react';
import * as Feather from 'react-feather';
import { useColorThemeStore } from '../js/store';
import { useLocation } from 'wouter';
import Icon from '../components/Icon';
import ListItemVertical from '../components/list/ListItemViertical';

const Wallet = () => {
  const [totalValue] = useState(30000);
  const [currency] = useState('USD');
  const { currentColorTheme } = useColorThemeStore();
  const [, setLocation] = useLocation();

  const cryptoAssets = [
    {
      symbol: 'ETH',
      price: 2454,
      change: '+1.34%',
      amount: 10,
      total: 24540,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    },
    {
      symbol: 'BTC',
      price: 43250,
      change: '+2.15%',
      amount: 0.15,
      total: 6487.5,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    },
    {
      symbol: 'USDT',
      price: 1.0,
      change: '+0.01%',
      amount: 5000,
      total: 5000,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    },
    {
      symbol: 'BNB',
      price: 312,
      change: '-0.85%',
      amount: 12,
      total: 3744,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    },
    {
      symbol: 'SOL',
      price: 125,
      change: '+4.23%',
      amount: 25,
      total: 3125,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    },
    {
      symbol: 'XRP',
      price: 0.58,
      change: '+1.25%',
      amount: 5000,
      total: 2900,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    },
    {
      symbol: 'ADA',
      price: 0.45,
      change: '-0.32%',
      amount: 6000,
      total: 2700,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
    },
    {
      symbol: 'DOGE',
      price: 0.085,
      change: '+2.54%',
      amount: 30000,
      total: 2550,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
    },
    {
      symbol: 'MATIC',
      price: 0.78,
      change: '+3.12%',
      amount: 3000,
      total: 2340,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
    },
    {
      symbol: 'DOT',
      price: 6.85,
      change: '-1.23%',
      amount: 300,
      total: 2055,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
    },
    {
      symbol: 'SHIB',
      price: 0.00001,
      change: '+5.67%',
      amount: 150000000,
      total: 1500,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png',
    },
    {
      symbol: 'AVAX',
      price: 35.25,
      change: '+2.89%',
      amount: 40,
      total: 1410,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    },
  ];

  const handleMaximize = async () => {
    console.log('Maximize');
  };

  return (
    <div className='overflow-hidden'>
      {/* Header Section */}
      <div className='flex justify-between items-center'>
        <p className='text-gray-600 mb-2'>Total Value</p>
        <div className='flex gap-4'>
          <Feather.Bell
            className='w-6 h-6 cursor-pointer hover:text-blue-500'
            onClick={() => setLocation('/me/notifications')}
          />
          <Feather.Maximize className='w-6 h-6' onClick={handleMaximize} />
        </div>
      </div>

      {/* Total Value Section */}
      <div className='mb-8'>
        <div className='flex items-baseline gap-2'>
          <h1 className='text-5xl font-bold'>{totalValue}</h1>
          <span className='text-xl'>{currency}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='overflow-x-auto'>
        <div className='flex gap-4 mb-8 min-w-max'>
          <button
            className={`py-2 px-3 rounded-full bg-${currentColorTheme}-100 flex items-center justify-center gap-1.5 text-black hover:bg-${currentColorTheme}-200`}
          >
            <Feather.Plus className='w-4 h-4' />
            <span className='text-sm'>Deposit</span>
          </button>
          <button
            className={`py-2 px-3 rounded-full bg-${currentColorTheme}-100 flex items-center justify-center gap-1.5 text-black hover:bg-${currentColorTheme}-200`}
          >
            <Feather.Send className='w-4 h-4' />
            <span className='text-sm'>Send</span>
          </button>
          <button
            className={`py-2 px-3 rounded-full bg-${currentColorTheme}-100 flex items-center justify-center gap-1.5 text-black hover:bg-${currentColorTheme}-200`}
          >
            <Feather.Repeat className='w-4 h-4' />
            <span className='text-sm'>Transfer</span>
          </button>
        </div>
      </div>

      {/* Crypto Assets List */}
      <div className='max-w-2xl mx-auto'>
        <div className='flex justify-end mb-4'>
          <Feather.PlusCircle className='w-6 h-6 text-gray-400 hover:text-blue-500 cursor-pointer' />
        </div>
        <div>
          {cryptoAssets.map((asset, index) => (
            <ListItemVertical
              key={index}
              icon={<Icon url={asset.icon} symbol={asset.symbol} />}
              title={asset.symbol}
              subtitle={`$${asset.price}`}
              right={{
                top: asset.amount,
                bottom: `$${asset.total}`,
              }}
              className='hover:bg-gray-50'
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/styles/*.css'],
  theme: {
    extend: {},
  },
  safelist: [
    // Selected bg color
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',

    // Unselected bg color
    'bg-blue-100',
    'bg-red-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-orange-100',

    // Unselected bg color
    'bg-blue-50',
    'bg-red-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-purple-50',
    'bg-pink-50',
    'bg-orange-50',

    // Disabled bg color
    'bg-blue-200',
    'bg-red-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-orange-200',
    'opacity-75',
    'text-gray-500',

    // Selected text color
    'text-blue-500',
    'text-red-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
    'text-pink-500',
    'text-orange-500',

    // Selected text color
    'text-blue-400',
    'text-red-400',
    'text-green-400',
    'text-yellow-400',
    'text-purple-400',
    'text-pink-400',
    'text-orange-400',

    'text-gray',
  ],
  plugins: [],
};

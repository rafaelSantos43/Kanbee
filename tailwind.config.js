/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        kanbee: {
          yellow: {
            DEFAULT: '#FFD24D', 
            light: '#FFECB3',
            dark: '#FFA000',
          },
          blue: {
            DEFAULT: '#4F86F7', 
            light: '#E6F4FE',
            dark: '#3A68C1',
          }
        },
        neutralDark: {
          100: '#b8b9b9',
          200: '#969696',
          300: '#8e8f8f',
          400: '#646565',
          500: '#3b3c3c',
          600: '#2d2e2e',
          700: '#202121',
          800: '#161717',
          900: '#0a0a0a',
        },
      },
    },
    fontSize: {
      xxs: '10px',
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '19px',
      xl: '22px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
  },
  plugins: [],
};

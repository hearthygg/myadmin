/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      "sidebar-logo":'#2b2f3a'
    }),
    extend: {
      height: {
        '40': '10rem',
      },
      rotate:{
        '270': '270deg'
      }
    }
  },
  plugins: [],


}

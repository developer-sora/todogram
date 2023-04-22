/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js}'],
  theme: {
    backgroundSize: {
      19: '19px',
      22: '22px',
    },
    backgroundImage: {
      'heart-border': "url('../public/image/heart-border.svg')",
      'heart-border-white': "url('../public/image/heart-border-white.svg')",
      'heart-hover': "url('../public/image/heart-hover.svg')",
      'heart-fill': "url('../public/image/heart-fill.svg')",
      'heart-fill-purple': "url('../public/image/heart-fill-purple.svg')",
      'icon-light': "url('../public/image/icon-light.svg')",
      'icon-dark': "url('../public/image/icon-dark.svg')",
      'icon-editMenu': "url('../public/image/icon-kebob.svg')",
    },
    extend: {},
  },
  plugins: [],
};

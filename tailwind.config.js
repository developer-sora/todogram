/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js}'],
  theme: {
    backgroundSize: {
      19: '19px',
      22: '20px',
    },
    backgroundImage: {
      'heart-border': "url('../static/images/heart-border.svg')",
      'heart-border-white': "url('../static/images/heart-border-white.svg')",
      'heart-hover': "url('../static/images/heart-hover.svg')",
      'heart-fill': "url('../static/images/heart-fill.svg')",
      'heart-fill-purple': "url('../static/images/heart-fill-purple.svg')",
      'icon-light': "url('../static/images/icon-light.svg')",
      'icon-dark': "url('../static/images/icon-dark.svg')",
      'icon-editMenu': "url('../static/images/icon-kebob.svg')",
    },
    extend: {},
  },
  plugins: [],
};

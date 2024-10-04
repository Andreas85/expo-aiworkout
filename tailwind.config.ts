/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter_400Regular', 'Inter_500Medium', 'Inter_700Bold'],
      },
      colors: {
        NAVBAR_BACKGROUND: '#252425',
        WORKOUT_PURPLE: '#A27DE1',
        WORKOUT_VERSION_BACKGROUND: '#493B42',
        WORKOUT_VERSION_BACKGROUND_ACTIVE: '#9C79C9',
        WORKOUT_BLACK: '#252425',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: any) {
      addUtilities({
        '.dynamic-height': {
          height: '100dvh',
        },
      });
    }),
  ],
};

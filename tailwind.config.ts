/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        NAVBAR_BACKGROUND: '#252425',
        WORKOUT_PURPLE: '#A27DE1',
        WORKOUT_VERSION_BACKGROUND: '#493B42',
        WORKOUT_VERSION_BACKGROUND_ACTIVE: '#9C79C9',
      },
    },
  },
  plugins: [],
};

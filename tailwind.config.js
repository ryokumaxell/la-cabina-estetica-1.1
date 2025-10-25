/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'frodyta-primary': '#3A6F43',
        'frodyta-secondary': '#000000',
      },
    },
  },
  plugins: [],
};

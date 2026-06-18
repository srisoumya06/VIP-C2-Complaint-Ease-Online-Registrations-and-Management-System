/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f6fe',
          100: '#e9edfc',
          200: '#cdd6f8',
          300: '#a0b1f2',
          400: '#6d84ea',
          500: '#4a60df', // Primary Brand Indigo
          600: '#3545c7',
          700: '#2b35a2',
          800: '#272f85',
          900: '#242b6f',
          950: '#151841',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

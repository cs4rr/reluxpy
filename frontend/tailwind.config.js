/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        leather: {
          50: '#faf6f1',
          100: '#f2e8db',
          200: '#e4cfb7',
          300: '#d4b08e',
          400: '#c4916a',
          500: '#b87a52',
          600: '#a66446',
          700: '#8a4f3b',
          800: '#714235',
          900: '#5d382e',
          950: '#331c17',
        },
        gold: {
          50: '#fdfae8',
          100: '#fbf4c4',
          200: '#f8e78c',
          300: '#f3d24a',
          400: '#ecbc1c',
          500: '#dca40f',
          600: '#be7f0a',
          700: '#985c0b',
          800: '#7d4911',
          900: '#6a3c14',
          950: '#3d1f07',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

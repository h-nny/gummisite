/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#eef6ec',
          100: '#dcead3',
          200: '#c0d4b3',
          400: '#6b8c5f',
          500: '#4a6e40',
          700: '#2c4526',
        },
      },
      boxShadow: {
        card: '0 35px 80px rgba(13, 32, 14, 0.22)',
      },
    },
  },
  plugins: [],
}

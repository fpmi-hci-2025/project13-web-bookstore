/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mobile app colors
        background: '#FFFAF4',
        surface: '#FFFFFF',
        'on-primary': '#121212',
        primary: {
          50: '#fdf2f2',
          100: '#fce4e4',
          200: '#facece',
          300: '#f5acad',
          400: '#ec7f81',
          500: '#B16668',
          600: '#a05557',
          700: '#864547',
          800: '#703c3e',
          900: '#5f3638',
          DEFAULT: '#B16668',
        },
        secondary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d2d1',
          300: '#b0b1af',
          400: '#888986',
          500: '#4F514E',
          600: '#5f615e',
          700: '#50524f',
          800: '#454744',
          900: '#3c3d3b',
          DEFAULT: '#4F514E',
        },
        accent: {
          DEFAULT: '#B16668',
          hover: '#a05557',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}

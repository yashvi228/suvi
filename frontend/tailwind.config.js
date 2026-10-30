/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#fbf7ef',
        cream: '#f4ebdb',
        beige: '#e8d9bf',
        gold: '#b8935a',
        gold2: '#d4b27a',
        ink: '#2b2118',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.25em',
        ultra: '.45em',
      }
    },
  },
  plugins: [],
}

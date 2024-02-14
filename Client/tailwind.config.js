/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode:'class',
  theme: {
    extend: {
      colors: {
        primaryColor: '#525151',
        secondaryColor: '#D1CFCE',
        beige: '#ede9e3',
        darkPrimary: "#0C0C0C",
        darkBackground: "#171717",
        darkText: "#D1D5DB",
        controlColor: "#4299e1"
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        fontTitle: ['Alegreya Sans'],
        fontBody: ['Clear Sans'],
      },
    },
  },
  plugins: [],
}
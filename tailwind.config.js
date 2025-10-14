/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
      },
    },
  },
  plugins: [],
}

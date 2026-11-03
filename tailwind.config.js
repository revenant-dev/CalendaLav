/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scansiona il SORGENTE leggibile (pre-offuscamento): contiene tutte le classi,
  // comprese quelle dentro le stringhe JS dei template. Non puntare a public/index.html,
  // perché lì le stringhe JS sono offuscate in base64 e le classi non sarebbero rilevabili.
  content: ['./src/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'sans-serif'],
        display: ['Outfit', 'ui-sans-serif', 'sans-serif'],
      },
      colors: {
        brand: { 50: '#eff6ff', 100: '#dbeafe', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 900: '#1e3a8a' },
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.05)',
        drawer: '-10px 0 40px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};


const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Veritas Navy Backgrounds
        'vt-deep':    '#010812',
        'vt-navy':    '#020d1f',
        'vt-card':    '#040f24',
        // Blue Accent
        'vt-blue':    '#1a6bff',
        'vt-blue-2':  '#2979ff',
        'vt-cyan':    '#00d4ff',
        'vt-light':   '#4da6ff',
        // Gold
        'vt-gold':    '#c9a227',
        'vt-gold-2':  '#d4af37',
        'vt-gold-lt': '#f0c040',
        // Green (verified)
        'vt-green':   '#00c853',
        'vt-green-2': '#00e676',
      },
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      boxShadow: {
        'vt-blue':  '0 0 40px rgba(26,107,255,0.25)',
        'vt-gold':  '0 0 40px rgba(201,162,39,0.3)',
        'vt-green': '0 0 20px rgba(0,200,83,0.4)',
      },
      backgroundImage: {
        'vt-hero': 'radial-gradient(ellipse 65% 80% at 18% 50%, rgba(26,107,255,0.16) 0%, transparent 65%), linear-gradient(180deg, #010812 0%, #020d1f 50%, #010812 100%)',
        'vt-card': 'linear-gradient(135deg, rgba(4,15,36,0.95) 0%, rgba(6,18,41,0.9) 100%)',
        'vt-gold-badge': 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #a07810 100%)',
      },
    },
  },
  plugins: [],
};

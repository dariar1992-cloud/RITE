/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        obsidian: '#080810',
        'deep-surface': '#0d0d1a',
        surface: '#1a1a24',
        gold: '#C9A53C',
        'gold-dim': '#7A6828',
        'gold-glow': '#E8C870',
        cream: '#EDE8D8',
        'cream-dim': '#A09880',
      },
      fontFamily: {
        serif: ['CormorantGaramond_300Light'],
        'serif-italic': ['CormorantGaramond_300Light_Italic'],
        sans: ['DMSans_400Regular'],
        'sans-light': ['DMSans_300Light'],
        'sans-medium': ['DMSans_500Medium'],
      },
      letterSpacing: {
        'caps-sm': '0.15em',
        'caps': '0.3em',
        'caps-lg': '0.5em',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#fcfae7',
        ink: '#1a1a1b',
        yellow: '#f4ff4d',
        'twitter-blue': '#1da1f2',
        'linkedin-blue': '#0077b5',
        'newsletter-teal': '#0d9488',
        'surface-dim': '#dcdbc9',
      },
      fontFamily: {
        syne: ['"Syne"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        hard: '4px 4px 0px #1a1a1b',
        'hard-lg': '6px 6px 0px #1a1a1b',
        'hard-yellow': '4px 4px 0px #f4ff4d',
      },
      borderWidth: {
        3: '3px',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
}

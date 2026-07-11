/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#07070A',
        card: 'rgba(13, 13, 19, 0.6)',
        border: 'rgba(255, 255, 255, 0.08)',
        neonBlue: {
          DEFAULT: '#00F2FE',
          glow: 'rgba(0, 242, 254, 0.35)',
        },
        emeraldGreen: {
          DEFAULT: '#00FF87',
          glow: 'rgba(0, 255, 135, 0.35)',
        },
        stadiumPurple: {
          DEFAULT: '#7F00FF',
          glow: 'rgba(127, 0, 255, 0.35)',
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-blue': '0 0 15px rgba(0, 242, 254, 0.4)',
        'neon-green': '0 0 15px rgba(0, 255, 135, 0.4)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}

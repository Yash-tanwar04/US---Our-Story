/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#fcedf2',
          200: '#f8bbd0',
          300: '#f48fb1',
          400: '#ec407a',
          500: '#d81b60',
          600: '#c2185b',
          700: '#ad1457',
          800: '#880e4f',
        },
        rose: {
          dust: '#b76e79',
          deep: '#8b263e',
          soft: '#e8c5ce',
        },
        paper: {
          ivory: '#fefcf6',
          cream: '#faf4ed',
          aged: '#f7eee3',
          border: '#e8decb',
          shadow: '#d4c5b3'
        },
        ink: {
          dark: '#3d312e',
          muted: '#685955',
          faded: '#94837f',
          red: '#9c2b45',
          blue: '#2c4366'
        },
        tape: 'rgba(240, 230, 212, 0.75)'
      },
      fontFamily: {
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
        script: ['"Beth Ellen"', '"Sacramento"', 'cursive'],
        casual: ['"Marck Script"', '"Shadows Into Light"', 'cursive'],
        title: ['"Cormorant Garamond"', '"Cinzel"', 'serif'],
        body: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'diary-cover': '0 20px 50px rgba(74, 38, 50, 0.4), 0 5px 15px rgba(0,0,0,0.1), inset 0 0 15px rgba(255, 255, 255, 0.2)',
        'diary-page': '0 10px 30px rgba(0,0,0,0.08), inset 0 0 20px rgba(210, 190, 175, 0.2)',
        'polaroid': '0 8px 20px rgba(60, 40, 45, 0.15)',
        'tape': '0 1px 3px rgba(0,0,0,0.1)'
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        'cover-texture': "url(\"data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(3deg)' }
        },
        petal: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(105vh) rotate(360deg)', opacity: '0' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        petal: 'petal 12s linear infinite'
      }
    },
  },
  plugins: [],
}

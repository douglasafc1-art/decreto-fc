/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        decreto: {
          blue: '#0A2A6B',      // azul royal (base)
          dark: '#050B18',      // fundo quase preto azulado
          navy: '#0E1B3A',      // azul-marinho
          electric: '#2E6BFF',  // azul elétrico
          cyan: '#3ED8F0',      // detalhes ciano
          white: '#F5F7FA',
          gold: '#E8B84B',      // caneca dourada do escudo
        },
      },
      fontFamily: {
        display: ['"Anton"', 'Impact', 'sans-serif'],
        body: ['"Barlow"', 'system-ui', 'sans-serif'],
        script: ['"Hurricane"', 'cursive'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        glow: { '0%,100%': { opacity: 0.6 }, '50%': { opacity: 1 } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

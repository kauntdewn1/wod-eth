/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        protocol: '#000000',
        token: '#ff1c16',
        arena: '#f4f0e9',
        // Mantém compatibilidade com código existente
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#ff1c16',
          600: '#e61912',
          700: '#cc1510',
        },
      },
      boxShadow: {
        'token': '0 0 8px rgba(255, 28, 22, 0.67)',
      },
    },
  },
  plugins: [],
};


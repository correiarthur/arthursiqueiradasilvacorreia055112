export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffdea9', // Fundo
        secondary: '#ffa56e', // Secundário
        primary: '#843523', // Botões
        hover: '#ffdea9', // Hover
        details: '#e8d19a', // Detalhes
        'soft-white': '#fdfaf5', // Creating a soft white for cards/inputs if needed
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['Lexend', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(132, 53, 35, 0.1), 0 2px 4px -1px rgba(132, 53, 35, 0.06)', // Light shadow with primary tint
      }
    },
  },
  plugins: [],
}
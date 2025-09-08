/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/flowbite-react/lib/esm/**/*.js', // Adicione esta linha
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Adicione esta linha
  ],
}
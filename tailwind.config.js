/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'Ubuntu', 'sans-serif'],
        'poppins-light': ['Poppins Light', 'Ubuntu', 'san-serif', 'serif'],
        'poppins-extra-bold': ['Poppins Extrabold', 'Ubuntu', 'san-serif', 'serif']
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["bumblebee", "dark", "emerald", "forest", "lofi", "synthwave", "retro", "cyberpunk", "halloween", "valentine", "garden", "forest", "dracula", "corporate", "winter"],
  },
  darkMode: 'class',
}


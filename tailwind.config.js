/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'requested-color': '#f3f6fc',
            },
            fontFamily: {
                'poppins': ['Poppins Regular', 'Ubuntu', 'sans-serif'],
                'poppins-light': ['Poppins Light', 'Ubuntu', 'san-serif', 'serif'],
                'poppins-medium': ['Poppins Medium', 'Ubuntu', 'san-serif', 'serif'],
                'poppins-bold': ['Poppins Bold', 'Ubuntu', 'san-serif', 'serif'],
                'poppins-extra-light': ['Poppins Extralight', 'Ubuntu', 'san-serif', 'serif'],
                'poppins-thin': ['Poppins Thin', 'Ubuntu', 'san-serif', 'serif'],
                'poppins-semi-bold': ['Poppins Semibold', 'Ubuntu', 'san-serif', 'serif'],
                'poppins-extra-bold': ['Poppins Extrabold', 'Ubuntu', 'san-serif', 'serif']
            },
        },
    },
    // eslint-disable-next-line no-undef
    plugins: [require('daisyui')],
    daisyui: {
        themes: ["bumblebee", "dark", "emerald", "forest", "lofi", "synthwave", "retro", "cyberpunk", "halloween", "valentine", "garden", "forest", "dracula", "corporate", "winter", "wireframe", "black"],
    },
    darkMode: 'class',
}


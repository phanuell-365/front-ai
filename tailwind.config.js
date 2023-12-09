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
            fontSize: {
                'xxs': '.65rem',
            },
            animation: {
                "scale-up-center": "scale-up-center 0.6s cubic-bezier(0.390, 0.575, 0.565, 1.000)   both",
                "slide-right": "slide-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both"
            },
            keyframes: {
                "scale-up-center": {
                    "0%": {
                        transform: "scale(.5)"
                    },
                    to: {
                        transform: "scale(1)"
                    }
                },
                "slide-right": {
                    "0%": {
                        transform: "translateX(-100px)",
                        opacity: "0"
                    },
                    to: {
                        transform: "translateX(0px)",
                        opacity: "1"
                    }
                }
            }
        },
    },
    // eslint-disable-next-line no-undef
    plugins: [require('daisyui')],
    daisyui: {
        themes: ["bumblebee", "dark", "emerald", "forest", "lofi", "synthwave", "retro", "cyberpunk", "halloween", "valentine", "garden", "forest", "dracula", "corporate", "winter", "wireframe", "black"],
    },
    darkMode: 'class',
}


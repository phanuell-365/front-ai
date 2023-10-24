import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    // resolve: {
    //     alias: {
    //         '@': fileURLToPath(new URL('./src', import.meta.url))
    //     }
    // },
    server: {
        host: '0.0.0.0',
    },
    define: {
        'process.env': process.env,
    },
    base: process.env.VITE_APP_BASE_URL || '/',
});

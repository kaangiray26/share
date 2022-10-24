import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    server: {
        port: 8000,
        hot: true,
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            'peerjs': path.resolve(__dirname, 'node_modules/peerjs'),
            'animejs': path.resolve(__dirname, 'node_modules/animejs/lib/anime.es.js'),
            'unique-names-generator': path.resolve(__dirname, 'node_modules/unique-names-generator'),
        }
    }
})

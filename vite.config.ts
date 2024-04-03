import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'node:path'

const defaultConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}

export default defineConfig(({ mode }) => {
  return {
    ...defaultConfig,
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target:
            mode === 'development'
              ? 'http://zaal.no-ip.info:8083/api/'
              : 'https://test-cashback.netlify.app/api/',
          changeOrigin: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

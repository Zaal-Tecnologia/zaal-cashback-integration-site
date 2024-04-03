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

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      ...defaultConfig,
      server: {
        port: 3000,
        proxy: {
          '/api': {
            target: 'http://zaal.no-ip.info:8083',
            changeOrigin: false,
            secure: false,
          },
        },
      },
    }
  } else {
    return {
      ...defaultConfig,
      proxy: {
        '/api': {
          target: 'http://zaal.no-ip.info:8083',
          changeOrigin: false,
          secure: false,
        },
      },
    }
  }
})

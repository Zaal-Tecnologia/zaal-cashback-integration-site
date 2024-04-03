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

export default defineConfig(({ mode, command }) => {
  const target =
    mode === 'development'
      ? 'http://zaal.no-ip.info:8083'
      : 'http://zaal.no-ip.info:8083'

  if (command === 'serve') {
    return {
      server: {
        port: 3000,
        proxy: {
          '/api': {
            target,
            changeOrigin: false,
            secure: false,
          },
        },
      },
      ...defaultConfig,
    }
  } else {
    return defaultConfig
  }
})

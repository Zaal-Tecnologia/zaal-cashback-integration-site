import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'node:path'

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')

  const target =
    mode === 'development'
      ? 'http://zaal.no-ip.info:8083'
      : mode === 'production'
        ? 'http://zaal.no-ip.info:8083'
        : 'http://zaal.no-ip.info:8083'

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
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
    plugins: [react()],
  }
})

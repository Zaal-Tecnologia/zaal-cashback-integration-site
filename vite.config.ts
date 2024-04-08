import { defineConfig, loadEnv } from 'vite'
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
  // const env = loadEnv(mode, process.cwd(), '')

  // process.env = { ...process.env,  }

  return {
    ...defaultConfig,
    server: {
      proxy: {
        '/api': {
          target: 'http://zaal.no-ip.info:8083/api/',
          changeOrigin: false,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
      // cors: false,
    },
    /** preview: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
      cors: false,
    }, */
  }
})

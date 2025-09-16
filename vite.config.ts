import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🔧 Vite Config:', {
    mode,
    NODE_ENV: process.env.NODE_ENV,
    VITE_API_URL: env.VITE_API_URL,
    VITE_WITH_CREDENTIALS: env.VITE_WITH_CREDENTIALS
  })

  return {
    plugins: [react()],
    define: {
      // ✅ กำหนด environment variables
      __DEV__: JSON.stringify(mode === 'development'),
      __PROD__: JSON.stringify(mode === 'production'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@stores': path.resolve(__dirname, './src/stores'),
        '@types': path.resolve(__dirname, './src/types'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@service': path.resolve(__dirname, './src/service'),
      },
    },
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8069',
          changeOrigin: true,
        },
      },
    },
    // ✅ เพิ่ม proxy กลับมาใน preview mode เพื่อให้ local preview ทำงานได้
    preview: {
      port: 4173,
      host: true,
      proxy: {
        '/api': {
          target: 'http://vps.theapds.org:8069',
          changeOrigin: true,
        },
      },
    },
  }
})
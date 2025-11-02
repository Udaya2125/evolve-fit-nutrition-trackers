import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests
      // This will forward any request starting with /api
      // from http://localhost:5173/api/search
      // to http://localhost:5001/api/search
      '/api': {
        target: 'http://localhost:5001', // Your backend server URL
        changeOrigin: true,
      },
    }
  }
})
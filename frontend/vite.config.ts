import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Only REST API calls go through the Vite proxy.
      // Socket.IO connects directly to the backend (see SocketContext.tsx)
      // to avoid the Vite WS-proxy ECONNABORTED crashes on Windows.
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})

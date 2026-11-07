import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})

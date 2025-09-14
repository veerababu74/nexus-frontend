import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  base: './',
  server: {
    proxy: {
      '/api': {
        target: 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/nexusai': {
        target: 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      },
      '/nexus': {
        target: 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path
      }
    }
  }
})

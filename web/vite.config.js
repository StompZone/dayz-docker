import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  cacheDir: '/tmp/vite',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./docroot/src/"),
    }
  },
  server: {
    fs: {
      allow: ['/node_modules', '/web']
    }
  }
})

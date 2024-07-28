import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  cacheDir: '/tmp/vite',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/web/docroot/src'
    }
  },
  server: {
    fs: {
      allow: ['/node_modules', '/web']
    }
  }
})

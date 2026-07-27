import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // 【追加】これでビルド後のファイルパスの先頭の「/」が外れます
  plugins: [react()],
  server: {
    proxy: {
      '^.*/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^.*api/, '/api')
      }
    }
  }
})

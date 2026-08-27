import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    base: '/pbs-editor-app/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@components': resolve('src/renderer/src/components'),
        '@lib': resolve('src/renderer/src/lib'),
        '@assets': resolve('src/renderer/src/assets'),
        '@routes': resolve('src/renderer/src/routes'),
        '@hooks': resolve('src/renderer/src/lib/hooks'),
        '@models': resolve('src/renderer/src/lib/models'),
        '@providers': resolve('src/renderer/src/lib/providers'),
        '@services': resolve('src/renderer/src/lib/services'),
        '@theme': resolve('src/renderer/src/lib/theme')
      }
    }
  }
})

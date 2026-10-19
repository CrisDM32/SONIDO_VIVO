import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const siteRoot = resolve(projectRoot, '../..')

// https://vite.dev/config/
export default defineConfig({
  root: siteRoot,
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        productos: resolve(siteRoot, 'productos.html'),
      },
    },
  },
})

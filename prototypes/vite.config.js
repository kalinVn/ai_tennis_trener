import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { mkdirSync, copyFileSync } from 'node:fs'

const require = createRequire(import.meta.url)
const root = fileURLToPath(new URL('../', import.meta.url))
export default defineConfig({
  root,
  plugins: [vue(), {
    name: 'preserve-prototype-navigation-script',
    closeBundle() {
      const target = root + '/prototypes/dist/docs/prototypes/design'
      mkdirSync(target, { recursive: true })
      copyFileSync(root + '/docs/prototypes/design/app.js', target + '/app.js')
    },
  }],
  resolve: { alias: { vue: require.resolve('vue/dist/vue.esm-bundler.js') } },
  server: { host: '127.0.0.1', open: false },
  build: {
    outDir: 'prototypes/dist',
    emptyOutDir: true,
    rollupOptions: { input: {
      training: root + '/docs/prototypes/design/pages/training.html',
      layout: root + '/docs/prototypes/design/layouts/training.html',
      camera: root + '/docs/prototypes/design/components/camera-preview.html',
    } },
  },
})

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
      const target = root + '/prototypes/dist/prototypes/design'
      mkdirSync(target, { recursive: true })
      copyFileSync(root + '/prototypes/design/app.js', target + '/app.js')
      const slider = '/components/home_page_slider'
      mkdirSync(target + slider, { recursive: true })
      copyFileSync(root + '/prototypes/design' + slider + '/video-demo.js', target + slider + '/video-demo.js')
    },
  }],
  resolve: { alias: { vue: require.resolve('vue/dist/vue.esm-bundler.js') } },
  server: { host: '127.0.0.1', open: false },
  build: {
    outDir: 'prototypes/dist',
    emptyOutDir: true,
    rollupOptions: { input: {
      home: root + '/prototypes/design/pages/index.html',
      checkout: root + '/prototypes/design/pages/checkout.html',
      training: root + '/prototypes/design/pages/training.html',
      layout: root + '/prototypes/design/layouts/training.html',
      camera: root + '/prototypes/design/components/camera-preview.html',
    } },
  },
})

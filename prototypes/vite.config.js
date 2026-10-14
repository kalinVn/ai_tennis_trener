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
      features: root + '/prototypes/design/pages/features.html',
      login: root + '/prototypes/design/pages/login.html',
      register: root + '/prototypes/design/pages/register.html',
      checkout: root + '/prototypes/design/components/checkout/checkout.html',
      subscription: root + '/prototypes/design/components/subscription/subscription.html',
      training: root + '/prototypes/design/pages/training.html',
      publicLayout: root + '/prototypes/design/layouts/public.html',
      authenticationLayout: root + '/prototypes/design/layouts/authentication.html',
      camera: root + '/prototypes/design/components/camera-preview.html',
      baseModal: root + '/prototypes/design/components/modals.html',
      textButton: root + '/prototypes/design/components/buttons/text-button.html',
      paymentStatus: root + '/prototypes/design/components/cards/payment-status-card.html',
      cookiePrivacySpecimen: root + '/prototypes/design/components/cookie-consent-banner.html',
      recaptchaField: root + '/prototypes/design/components/fields/recaptcha-field.html',
      socialAuthButtons: root + '/prototypes/design/components/buttons/social-auth-buttons.html',
      cookiePrivacyApp: root + '/prototypes/components/features/CookiePrivacyPolicy/mountCookiePrivacyPolicy.js',
    }, output: {
      entryFileNames: chunk => chunk.name === 'cookiePrivacyApp' ? 'assets/cookiePrivacyApp.js' : 'assets/[name]-[hash].js',
    } },
  },
})

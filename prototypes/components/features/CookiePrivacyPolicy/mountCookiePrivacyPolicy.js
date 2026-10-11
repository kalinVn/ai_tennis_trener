import { createApp } from 'vue'
import CookiePrivacyPolicy from './CookiePrivacyPolicy.vue'

const root = document.createElement('div')
root.id = 'cookie-privacy-policy-root'
document.body.append(root)
createApp(CookiePrivacyPolicy).mount(root)

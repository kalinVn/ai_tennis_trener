import { defineStore } from 'pinia'
import { submitDemoAuth } from '../services/demoAuthService.js'

export const useAuthStore = defineStore('prototype-user-auth', {
  state: () => ({
    mode: 'login',
    email: '',
    password: '',
    pending: false,
    message: '',
    revision: 0,
  }),
  actions: {
    open(mode) {
      this.revision++
      this.mode = mode
      this.email = ''
      this.password = ''
      this.message = ''
      this.pending = false
    },
    async submit() {
      if (this.pending) return
      this.message = ''
      if (!this.email.trim() || !this.password) {
        this.message = 'Fill in both fields with demo values.'
        return
      }
      const revision = this.revision
      this.pending = true
      this.password = ''
      try {
        const result = await submitDemoAuth(this.mode)
        if (revision === this.revision) this.message = result.message
      } catch {
        if (revision === this.revision) this.message = 'Demo submission failed.'
      } finally {
        if (revision === this.revision) this.pending = false
      }
    },
  },
})

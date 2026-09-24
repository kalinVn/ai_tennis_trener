<script setup>
import { onUnmounted } from 'vue'
import { useAuthStore } from '../stores/useAuthStore.js'

const auth = useAuthStore()
onUnmounted(auth.$reset)
</script>

<template>
  <form @submit.prevent="auth.submit()">
    <p>Structure demo only. Do not enter real credentials.</p>
    <label>
      Email
      <input v-model="auth.email" type="email" autocomplete="email" required />
    </label>
    <label>
      Password
      <input v-model="auth.password" type="password"
        :autocomplete="auth.mode === 'register' ? 'new-password' : 'current-password'" required />
    </label>
    <button type="submit" :disabled="auth.pending">
      {{ auth.pending ? 'Please wait…' : auth.mode === 'register' ? 'Demo register' : 'Demo login' }}
    </button>
    <p role="status">{{ auth.message }}</p>
  </form>
</template>

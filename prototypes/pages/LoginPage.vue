<script setup>
import AuthForm from '../components/forms/AuthForm.vue'
import { useAuthStore } from '../stores/useAuthStore.js'

useAuthStore().open('login')
</script>

<template>
  <main>
    <h1>Login — demo</h1>
    <AuthForm />
  </main>
</template>

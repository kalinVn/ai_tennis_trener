<script setup>
import AuthForm from '../components/AuthForm.vue'
import { useAuthStore } from '../stores/useAuthStore.js'

useAuthStore().open('register')
</script>

<template>
  <main>
    <h1>Register — demo</h1>
    <AuthForm />
  </main>
</template>

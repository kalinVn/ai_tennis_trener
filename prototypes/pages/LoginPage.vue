<script setup>
import LoginForm from '../components/forms/LoginForm.vue'
</script>

<template>
  <div class="public-page">
    <nav class="public-nav">
      <div class="container nav-inner">
        <a class="brand" href="index.html"><span class="logo">AI</span>Tennis AI Coach</a>
        <div class="nav-links"><a href="index.html">Home</a><a href="features.html">Features</a><a href="training.html">Training</a></div>
        <div class="nav-actions"><a class="btn primary small" href="register.html">Start free</a></div>
      </div>
    </nav>
    <main class="auth-page container">
      <LoginForm register-href="register.html" />
    </main>
    <footer class="public-footer"><div class="container footer-row"><span>© Tennis AI Coach · visual prototype</span><span>Privacy · Terms · Support</span></div></footer>
  </div>
</template>

<style scoped>
.public-page { min-height: 100vh; display: flex; flex-direction: column; }
.auth-page { flex: 1; display: grid; place-items: center; padding: 60px 0 80px; }
@media (max-width: 530px) { .auth-page { padding: 30px 0 50px; } }
</style>

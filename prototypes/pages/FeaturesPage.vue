<script setup>
import FeatureCard from '../components/cards/FeatureCard.vue'

const features = [
  { number: '01', title: 'Live Training', description: 'Camera preview, clear controls, analysis state and realtime coaching feedback.' },
  { number: '02', title: 'Session Review', description: 'Summaries, technique issues, metrics, recommendations and key moments.' },
  { number: '03', title: 'Session History', description: 'Review previous training sessions and supported coaching feedback.' },
]
</script>

<template>
  <div class="public-page">
    <nav class="public-nav">
      <div class="container nav-inner">
        <a class="brand" href="index.html"><span class="logo">AI</span>Tennis AI Coach</a>
        <div class="nav-links">
          <a href="index.html">Home</a>
          <a href="features.html" aria-current="page">Features</a>
          <a href="training.html">Training</a>
        </div>
        <div class="nav-actions">
          <a class="btn small" href="login.html">Log in</a>
          <a class="btn primary small" href="register.html">Start free</a>
        </div>
      </div>
    </nav>

    <main class="container public-main">
      <div class="page-head">
        <div class="eyebrow">PUBLIC LAYOUT</div>
        <h1>Features</h1>
        <p>One dedicated route for the product features.</p>
      </div>
      <section class="section" aria-labelledby="features-heading">
        <h2 id="features-heading">A coaching product, not just another sports dashboard.</h2>
        <p>The interface is centered around one job: start quickly, understand what is happening, and know what to do next.</p>
        <div class="grid3">
          <FeatureCard v-for="feature in features" :key="feature.number" v-bind="feature" />
        </div>
      </section>
      <div class="cta">
        <a class="btn primary" href="login.html">Log in to choose a plan</a>
        <a class="btn" href="training.html">Training preview</a>
      </div>
    </main>

    <footer class="public-footer">
      <div class="container footer-row">
        <span>© Tennis AI Coach · visual prototype</span>
        <span>Privacy · Terms · Support</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.public-page { min-height: 100vh; display: flex; flex-direction: column; }
.public-main { flex: 1; }
</style>

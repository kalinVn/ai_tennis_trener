<script setup>
defineProps({
  number: { type: [String, Number], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <article class="feature-card">
    <div class="feature-card__number">{{ number }}</div>
    <h3 class="feature-card__title">{{ title }}</h3>
    <p class="feature-card__description">{{ description }}</p>
  </article>
</template>

<style scoped>
/* Matches the existing feature-card surface, number badge and typography. */
.feature-card {
  box-sizing: border-box;
  width: min(360px, 100%);
  min-width: 0;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 22px;
  background: #0d1913;
  color: #f4f7f5;
  font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  overflow-wrap: anywhere;
}

.feature-card__number {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
  border-radius: 14px;
  background: #284a24;
  color: #b7ff4a;
}

.feature-card__title {
  margin: 0 0 10px;
  font-size: 21px;
  font-weight: 700;
  line-height: inherit;
}

.feature-card__description {
  margin: 0;
  color: #a8b5ae;
}
</style>

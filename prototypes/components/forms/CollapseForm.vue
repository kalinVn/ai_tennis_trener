<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <!-- Native details owns only local expanded/collapsed UI state. -->
  <details class="collapse-form" open>
    <summary class="collapse-form__header">
      <div class="collapse-form__heading">
        <h2 class="collapse-form__title">{{ title }}</h2>
        <p v-if="description" class="collapse-form__description">{{ description }}</p>
      </div>
      <span class="collapse-form__icon" aria-hidden="true" />
    </summary>
    <div class="collapse-form__body">
      <slot />
      <div v-if="$slots.footer" class="collapse-form__footer">
        <slot name="footer" />
      </div>
    </div>
  </details>
</template>

<style scoped>
/* Container styles from Profile's collapsible form section. */
.collapse-form {
  box-sizing: border-box;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 22px;
  background: #0d1913;
  color: #f4f7f5;
  font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
.collapse-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 23px 25px;
  cursor: pointer;
  list-style: none;
}
.collapse-form__header::-webkit-details-marker { display: none; }
.collapse-form__header:focus-visible { outline: 2px solid #65e8ff; outline-offset: -3px; }
.collapse-form__heading { min-width: 0; overflow-wrap: anywhere; }
.collapse-form__title { margin: 0 0 5px; font-size: 20px; line-height: 1.2; font-weight: 700; letter-spacing: 0; }
.collapse-form__description { margin: 0; color: #a8b5ae; font-size: 13px; }
.collapse-form__icon { color: #b7ff4a; font-size: 25px; flex: 0 0 auto; }
.collapse-form__icon::before { content: '+'; }
.collapse-form[open] > .collapse-form__header .collapse-form__icon::before { content: '−'; }
.collapse-form__body { border-top: 1px solid rgba(255, 255, 255, .12); padding: 23px 25px 25px; }
.collapse-form__footer { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 12px; margin-top: 9px; }
.collapse-form__footer :slotted(.button) { min-height: 51px; max-width: 100%; white-space: normal; }
@media (max-width: 1100px) {
  .collapse-form__header { min-height: 44px; }
  .collapse-form__icon { display: grid; place-items: center; flex: 0 0 44px; width: 44px; height: 44px; font-size: 30px; line-height: 1; }
}
@media (max-width: 720px) {
  .collapse-form__header { padding: 18px; }
  .collapse-form__body { padding: 20px 18px; }
  .collapse-form__title { font-size: 18px; }
}
</style>

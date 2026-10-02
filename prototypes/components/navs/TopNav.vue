<script setup>
import { ref, useId, onMounted, onBeforeUnmount } from 'vue'
import Button from '../../../docs/prototypes/design/components/buttons/Button.vue'

const props = defineProps({
  items: { type: Array, default: () => [] }
})
const emit = defineEmits(['login', 'register'])
const menuId = useId()
const menuOpen = ref(false)
const menu = ref(null)
const toggle = ref(null)
let phone

function closeMenu(restoreFocus = false) {
  menuOpen.value = false
  if (restoreFocus) toggle.value?.$el.focus()
}

function requestAuth(action) {
  closeMenu()
  emit(action)
}

function syncViewport() {
  if (phone.matches && menu.value?.contains(document.activeElement)) {
    toggle.value?.$el.focus()
  } else if (!phone.matches && document.activeElement === toggle.value?.$el) {
    menu.value?.querySelector('a')?.focus()
  }
  closeMenu()
}

onMounted(() => {
  phone = window.matchMedia('(max-width: 720px)')
  phone.addEventListener('change', syncViewport)
})
onBeforeUnmount(() => phone?.removeEventListener('change', syncViewport))
</script>

<template>
  <header class="top-nav" @keydown.esc="closeMenu(menuOpen)">
    <div class="top-nav__inner">
      <a class="top-nav__brand" href="/">
        <span class="top-nav__logo">AI</span>Tennis AI Coach
      </a>
      <Button
        ref="toggle"
        class="top-nav__toggle"
        variant="secondary"
        size="small"
        :aria-expanded="menuOpen"
        :aria-controls="menuId"
        :aria-label="menuOpen ? 'Close public navigation' : 'Open public navigation'"
        @click="menuOpen = !menuOpen"
      ><span class="top-nav__menu-icon" aria-hidden="true">☰</span></Button>
      <nav
        :id="menuId"
        ref="menu"
        class="top-nav__links"
        :class="{ 'top-nav__links--open': menuOpen }"
        aria-label="Main navigation"
      >
        <a
          v-for="item in props.items"
          :key="item.href"
          :href="item.href"
          :aria-current="item.active ? 'page' : undefined"
          @click="closeMenu(menuOpen)"
        >{{ item.label }}</a>
      </nav>
      <div class="top-nav__actions">
        <Button variant="secondary" size="small" @click="requestAuth('login')">Login</Button>
        <Button variant="primary" size="small" @click="requestAuth('register')">Start Free</Button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(7, 16, 12, .94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, .12);
  color: #f4f7f5;
  font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
.top-nav__inner {
  box-sizing: border-box;
  width: min(1160px, 92%);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 17px 0;
  flex-wrap: wrap;
}
.top-nav a { color: inherit; text-decoration: none; }
.top-nav a:focus-visible { outline: 2px solid #65e8ff; outline-offset: 2px; }
.top-nav__brand { display: flex; align-items: center; gap: 10px; font-weight: 850; white-space: nowrap; }
.top-nav__logo {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  border-radius: 11px;
  background: #b7ff4a;
  color: #07100c;
  font-size: 14px;
}
.top-nav__links, .top-nav__actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.top-nav__links a { box-sizing: border-box; color: #a8b5ae; padding: 8px; }
.top-nav__links a:hover, .top-nav__links a[aria-current="page"] { color: #b7ff4a; }
.top-nav__toggle { display: none; }
.top-nav__menu-icon { font-size: 22px; }
@media (max-width: 900px) {
  .top-nav__inner { justify-content: center; }
}
@media (max-width: 720px) {
  .top-nav__inner { justify-content: space-between; gap: 8px; }
  .top-nav__brand { font-size: 13px; gap: 8px; }
  .top-nav__logo { width: 32px; height: 32px; }
  .top-nav__toggle { display: inline-flex; width: 44px; height: 44px; padding: 0; }
  .top-nav__actions { margin-left: auto; }
  .top-nav__actions :deep(.button) { min-height: 44px; }
  .top-nav__links { order: 4; width: 100%; display: none; flex-direction: column; align-items: stretch; gap: 5px; }
  .top-nav__links--open { display: flex; }
  .top-nav__links a { min-height: 44px; padding: 12px 14px; }
}
@media (min-width: 740px) and (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .top-nav { position: static; }
}
</style>

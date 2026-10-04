<script setup>
import { ref, useId, nextTick, onMounted, onBeforeUnmount } from 'vue'
import Button from '../../design/components/buttons/Button.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
})
const navigationId = useId()
const isPhone = ref(false)
const isOpen = ref(false)
const sidebar = ref(null)
const toggle = ref(null)
let phone
let previousOverflow

function releaseScroll() {
  if (previousOverflow !== undefined) {
    document.body.style.overflow = previousOverflow
    previousOverflow = undefined
  }
}

function closeNavigation(restoreFocus = true) {
  if (!isOpen.value) return
  isOpen.value = false
  sidebar.value?.close()
  releaseScroll()
  if (restoreFocus) toggle.value?.$el.focus()
}

function openNavigation() {
  if (!isPhone.value || isOpen.value) return
  sidebar.value.showModal()
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isOpen.value = true
}

function handleBackdrop(event) {
  if (event.target !== sidebar.value || !isOpen.value) return
  const box = sidebar.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
    closeNavigation()
  }
}

async function syncViewport() {
  const active = document.activeElement
  const hadNavigationFocus = sidebar.value?.contains(active) || active === toggle.value?.$el
  closeNavigation(false)
  isPhone.value = phone.matches
  await nextTick()
  if (hadNavigationFocus) {
    if (isPhone.value) toggle.value?.$el.focus()
    else sidebar.value?.querySelector('[aria-current="page"], a')?.focus()
  }
}

onMounted(() => {
  phone = window.matchMedia('(max-width: 720px), (max-width: 950px) and (max-height: 500px) and (orientation: landscape)')
  phone.addEventListener('change', syncViewport)
  syncViewport()
})
onBeforeUnmount(() => {
  phone?.removeEventListener('change', syncViewport)
  closeNavigation(false)
  releaseScroll()
})
</script>

<template>
  <div class="sidebar-nav">
    <div v-if="isPhone" class="sidebar-nav__mobile-header">
      <Button
        ref="toggle"
        class="sidebar-nav__control"
        variant="secondary"
        aria-label="Open navigation"
        :aria-controls="navigationId"
        :aria-expanded="isOpen"
        aria-haspopup="dialog"
        @click="openNavigation"
      ><span aria-hidden="true">☰</span></Button>
      <span class="sidebar-nav__mobile-brand">Tennis AI Coach</span>
    </div>
    <component
      :is="isPhone ? 'dialog' : 'aside'"
      :id="navigationId"
      ref="sidebar"
      class="sidebar-nav__panel"
      :class="{ 'sidebar-nav__panel--drawer': isPhone }"
      aria-label="Application navigation"
      @cancel.prevent="closeNavigation()"
      @click="handleBackdrop"
    >
      <Button
        v-if="isPhone"
        class="sidebar-nav__control sidebar-nav__close"
        variant="secondary"
        aria-label="Close navigation"
        autofocus
        @click="closeNavigation()"
      ><span aria-hidden="true">×</span></Button>
      <a class="sidebar-nav__brand" href="/dashboard" @click="closeNavigation()">
        <span class="sidebar-nav__logo">AI</span>Coach
      </a>
      <nav class="sidebar-nav__links" aria-label="Application pages">
        <a
          v-for="item in props.items"
          :key="item.href"
          :href="item.href"
          :aria-current="item.active ? 'page' : undefined"
          @click="closeNavigation()"
        >
          <component v-if="item.icon" :is="item.icon" class="sidebar-nav__icon" aria-hidden="true" focusable="false" />
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </component>
  </div>
</template>

<style scoped>
.sidebar-nav {
  width: 244px;
  flex: 0 0 244px;
  align-self: start;
  position: sticky;
  top: 0;
  color: #f4f7f5;
  font: 16px/1.55 Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
}
.sidebar-nav__panel {
  box-sizing: border-box;
  width: 244px;
  height: 100vh;
  padding: 24px 15px;
  overflow: auto;
  background: #09150f;
  color: inherit;
  border: 0;
  border-right: 1px solid rgba(255, 255, 255, .12);
}
.sidebar-nav a { color: inherit; text-decoration: none; }
.sidebar-nav a:focus-visible { outline: 2px solid #65e8ff; outline-offset: 2px; }
.sidebar-nav__brand { display: flex; align-items: center; gap: 10px; font-weight: 850; white-space: nowrap; }
.sidebar-nav__logo {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  flex: 0 0 39px;
  border-radius: 11px;
  background: #b7ff4a;
  color: #07100c;
  font-size: 14px;
}
.sidebar-nav__links { display: grid; gap: 5px; margin-top: 30px; }
.sidebar-nav__links a { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 12px; color: #a8b5ae; }
.sidebar-nav__links a:hover, .sidebar-nav__links a[aria-current="page"] { color: #b7ff4a; background: #13231b; }
.sidebar-nav__links a span { min-width: 0; overflow-wrap: anywhere; }
.sidebar-nav__icon { width: 20px; height: 20px; flex: 0 0 20px; }
.sidebar-nav__mobile-header { display: flex; align-items: center; gap: 12px; padding: 12px 18px; border-bottom: 1px solid rgba(255, 255, 255, .12); }
.sidebar-nav__mobile-brand { font-weight: 850; font-size: 14px; }
.sidebar-nav__control { width: 44px; height: 44px; flex: 0 0 44px; padding: 0; font-size: 26px; line-height: 1; }
.sidebar-nav__close { position: absolute; top: 24px; right: 15px; }
.sidebar-nav__panel--drawer {
  position: fixed;
  inset: 0 auto 0 0;
  width: min(300px, calc(100% - 56px));
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  overscroll-behavior: contain;
}
.sidebar-nav__panel--drawer[open] { animation: sidebar-enter .2s ease; }
@keyframes sidebar-enter { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@media (prefers-reduced-motion: reduce) {
  .sidebar-nav__panel--drawer[open] { animation: none; }
}
.sidebar-nav__panel--drawer::backdrop { background: #0009; }
.sidebar-nav__panel--drawer .sidebar-nav__brand { min-height: 44px; padding-right: 52px; }
@media (max-width: 720px), (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .sidebar-nav { width: 100%; flex-basis: auto; position: static; }
}
</style>

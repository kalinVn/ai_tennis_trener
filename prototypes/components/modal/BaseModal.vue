<script setup>
import { nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
})
const emit = defineEmits(['close'])
const dialog = ref(null)
const titleId = useId()
let previousFocus = null
let previousOverflow

async function show() {
  await nextTick()
  if (!dialog.value || dialog.value.open) return
  previousFocus = document.activeElement
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value.showModal()
}

function releaseModal(restoreFocus = true) {
  if (dialog.value?.open) dialog.value.close()
  if (previousOverflow !== undefined) {
    document.body.style.overflow = previousOverflow
    previousOverflow = undefined
  }
  if (restoreFocus) previousFocus?.focus?.({ preventScroll: true })
  previousFocus = null
}

function close() {
  releaseModal()
  emit('close')
}

function handleBackdrop(event) {
  if (event.target === dialog.value) close()
}

watch(() => props.open, value => {
  if (value) show()
  else releaseModal()
}, { immediate: true })

onBeforeUnmount(() => releaseModal(false))
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="base-modal"
      :aria-labelledby="titleId"
      @cancel.prevent="close"
      @click="handleBackdrop"
    >
      <section class="base-modal__panel">
        <header class="base-modal__header">
          <div>
            <div v-if="$slots.eyebrow" class="base-modal__eyebrow"><slot name="eyebrow" /></div>
            <h2 :id="titleId">{{ title }}</h2>
          </div>
          <button class="base-modal__close" type="button" aria-label="Close" autofocus @click="close">×</button>
        </header>
        <div class="base-modal__body">
          <slot />
        </div>
      </section>
    </dialog>
  </Teleport>
</template>

<style scoped>
.base-modal { box-sizing: border-box; width: min(720px, calc(100% - 32px)); max-width: none; max-height: min(760px, calc(100dvh - 32px)); padding: 0; border: 1px solid rgba(255,255,255,.16); border-radius: 18px; background: #0d1913; box-shadow: 0 24px 70px rgba(0,0,0,.6); color: #f4f7f5; font: 16px/1.55 Inter, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.base-modal::backdrop { background: rgba(0,0,0,.72); backdrop-filter: blur(3px); }
.base-modal__panel { display: grid; grid-template-rows: auto minmax(0,1fr); max-height: min(760px, calc(100dvh - 32px)); overflow: hidden; }
.base-modal__header { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 20px 22px; border-bottom: 1px solid rgba(255,255,255,.12); }
.base-modal__header h2 { margin: 2px 0 0; font-size: 23px; }
.base-modal__eyebrow { color: #b7ff4a; font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.base-modal__close { flex: 0 0 44px; width: 44px; height: 44px; padding: 0; border: 1px solid rgba(255,255,255,.16); border-radius: 10px; background: transparent; color: #f4f7f5; font-size: 28px; cursor: pointer; }
.base-modal__close:hover { border-color: #b7ff4a; color: #b7ff4a; }
.base-modal__close:focus-visible { outline: 2px solid #65e8ff; outline-offset: 3px; }
.base-modal__body { min-width: 0; min-height: 0; max-height: min(60dvh, 560px); overflow-x: hidden; overflow-y: auto; overflow-wrap: anywhere; overscroll-behavior: contain; scrollbar-gutter: stable; scrollbar-width: thin; scrollbar-color: rgba(183,255,74,.58) rgba(9,21,15,.72); }
.base-modal__body::-webkit-scrollbar { width: 10px; height: 10px; }
.base-modal__body::-webkit-scrollbar-track { background: rgba(9,21,15,.72); border-left: 1px solid rgba(255,255,255,.06); }
.base-modal__body::-webkit-scrollbar-thumb { min-height: 44px; border: 2px solid #09150f; border-radius: 999px; background: rgba(183,255,74,.58); }
.base-modal__body::-webkit-scrollbar-thumb:hover { background: #b7ff4a; }
.base-modal__body::-webkit-scrollbar-thumb:active { background: #65e8ff; }
@media (max-width: 600px) {
  .base-modal { width: min(100% - 20px, 720px); max-height: calc(100dvh - 20px); }
  .base-modal__panel { max-height: calc(100dvh - 20px); }
  .base-modal__header { padding: 17px 18px; }
  .base-modal__header h2 { font-size: 20px; }
}
</style>

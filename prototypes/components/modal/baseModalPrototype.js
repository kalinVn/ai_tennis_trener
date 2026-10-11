import { createApp, h, ref, shallowRef } from 'vue'
import BaseModal from './BaseModal.vue'

const SummaryContent = {
  render: () => h('div', { class: 'base-modal-example' }, [
    h('h3', 'Parent-supplied content'),
    h('p', 'BaseModal provides the shell while the caller supplies this heading, copy, and any actions or controls required by its feature.'),
    h('button', { class: 'btn primary', type: 'button' }, 'Example action'),
  ]),
}

const ScrollContent = {
  render: () => h('div', { class: 'base-modal-example' }, [
    h('h3', 'Scrollable custom content'),
    h('p', 'The body scrolls independently when arbitrary content is taller than the available viewport.'),
    h('ol', { class: 'base-modal-example__list' }, Array.from({ length: 18 }, (_, index) =>
      h('li', `Generic content section ${index + 1}: supplied by the active parent component.`))),
  ]),
}

createApp({
  setup() {
    const open = ref(false)
    const title = ref('')
    const activeContent = shallowRef(SummaryContent)

    function show(nextTitle, component) {
      title.value = nextTitle
      activeContent.value = component
      open.value = true
    }

    return () => h('div', [
      h('div', { class: 'base-modal-specimen__actions' }, [
        h('button', { class: 'btn primary', type: 'button', onClick: () => show('Custom content', SummaryContent) }, 'Open custom content'),
        h('button', { class: 'btn', type: 'button', onClick: () => show('Scrollable content', ScrollContent) }, 'Open scrollable content'),
      ]),
      h(BaseModal, { open: open.value, title: title.value, onClose: () => { open.value = false } }, {
        eyebrow: () => 'Shared modal shell',
        default: () => h(activeContent.value),
      }),
    ])
  },
}).mount('#base-modal-prototype')

import { createApp, h } from 'vue'
import TextButton from './TextButton.vue'

const examples = [
  ['text-button-default', ['Cookie Policy', 'Privacy Policy', 'Manage Preferences'], false, 'accent'],
  ['text-button-context', ['Cookie Settings'], false, 'inherit'],
  ['text-button-disabled', ['Unavailable action'], true, 'accent'],
]

for (const [target, labels, disabled, tone] of examples) {
  createApp({
    render: () => h('div', { class: 'flex' }, labels.map(label => h(TextButton, {
      disabled,
      tone,
      onClick: () => {
        document.querySelector('#text-button-status').textContent = `${label} activated. The parent owns this action.`
      },
    }, () => label))),
  }).mount(`#${target}`)
}

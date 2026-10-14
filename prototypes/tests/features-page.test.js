import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')

test('Features HTML entry mounts the Vue Features page', () => {
  const html = read('../design/pages/features.html')
  const entry = read('../features/main.js')
  assert.match(html, /id="app"/)
  assert.match(html, /features\/main\.js/)
  assert.match(entry, /FeaturesPage\.vue/)
  assert.match(entry, /createApp\(FeaturesPage\)\.mount\('#app'\)/)
})

test('FeaturesPage composes three FeatureCard instances and preserves both actions', () => {
  const page = read('../pages/FeaturesPage.vue')
  assert.match(page, /FeatureCard/)
  assert.match(page, /v-for="feature in features"/)
  for (const value of ['01', 'Live Training', '02', 'Session Review', '03', 'Session History']) {
    assert.match(page, new RegExp(value))
  }
  assert.match(page, /Log in to choose a plan/)
  assert.match(page, /Training preview/)
})

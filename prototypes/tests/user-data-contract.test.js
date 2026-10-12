import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const contracts = readFileSync(new URL('../../docs/frontend/integration-contracts.md', import.meta.url), 'utf8')
const pagesAndRoutes = readFileSync(new URL('../../docs/frontend/pages-and-routes.md', import.meta.url), 'utf8')
const frontend = readFileSync(new URL('../../docs/frontend/frontend.md', import.meta.url), 'utf8')

test('authenticated initialization consistently uses GET user-data with bearer auth and no request body', () => {
  assert.match(contracts, /### Get user data/)
  assert.match(contracts, /GET \/api\/v1\/user-data HTTP\/1\.1/)
  assert.match(contracts, /Authorization: Bearer <accessToken>/)
  assert.match(contracts, /The request has no JSON body/)
  assert.doesNotMatch(contracts, /progressSummary/)
  for (const sessionId of ['session_123', 'session_122', 'session_121']) {
    assert.match(contracts, new RegExp(`"id": "${sessionId}"`))
  }

  for (const source of [contracts, pagesAndRoutes, frontend]) {
    assert.doesNotMatch(source, /\/api\/v1\/users\/me\/application-data/)
  }
})

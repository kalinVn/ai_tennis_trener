import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const contracts = readFileSync(new URL('../../docs/frontend/integration-contracts.md', import.meta.url), 'utf8')

test('training lifecycle documents create, complete, and abandon request and response contracts', () => {
  for (const endpoint of [
    'POST /api/v1/training/sessions HTTP/1.1',
    'POST /api/v1/training/sessions/{sessionId}/complete HTTP/1.1',
    'POST /api/v1/training/sessions/{sessionId}/abandon HTTP/1.1',
  ]) assert.ok(contracts.includes(endpoint), `${endpoint} should be documented`)

  for (const field of [
    'analysisWebSocketUrl',
    'completedAt',
    'endedAt',
  ]) assert.match(contracts, new RegExp(`"${field}"`))

  assert.match(contracts, /The request has no JSON body/)
  assert.match(contracts, /Reconnection for the same active session retains the same `sessionId`/)
  assert.match(contracts, /operation is idempotent/i)
  assert.match(contracts, /WebSocket message 1 \(text\):\s+JSON frame metadata/)
  assert.match(contracts, /WebSocket message 2 \(binary\):\s+<raw JPEG bytes for that frame>/)
  assert.match(contracts, /The JPEG is binary, not Base64 or a JSON field/)
  assert.match(contracts, /Metadata and binary payload form an ordered pair/)
})

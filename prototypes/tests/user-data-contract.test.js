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

test('personal information response fields stay synchronized across GET user-data and PATCH', () => {
  const canonicalFields = [
    'firstName',
    'lastName',
    'username',
    'displayName',
    'email',
    'emailVerified',
    'phoneCountryCode',
    'phone',
    'phoneVerified',
    'dateOfBirth',
    'country',
    'city',
    'bio',
  ]

  const getResponseMatch = contracts.match(/### Get user data[\s\S]*?— response body:\s*```json\s*([\s\S]*?)```/)
  assert.ok(getResponseMatch, 'GET user-data response example is present')
  const getResponse = JSON.parse(getResponseMatch[1])

  const patchMatch = contracts.match(/- `PATCH \/api\/v1\/users\/me\/personal-information`[\s\S]*?— request body:\s*```json\s*([\s\S]*?)```[\s\S]*?— response body:\s*```json\s*([\s\S]*?)```/)
  assert.ok(patchMatch, 'Personal Information PATCH request and response examples are present')
  const patchRequest = JSON.parse(patchMatch[1])
  const patchResponse = JSON.parse(patchMatch[2])

  assert.deepEqual(Object.keys(getResponse.personalInformation), canonicalFields)
  assert.deepEqual(Object.keys(patchResponse), canonicalFields)
  assert.deepEqual(Object.keys(patchRequest), canonicalFields.filter(field => !['emailVerified', 'phoneVerified'].includes(field)))
})

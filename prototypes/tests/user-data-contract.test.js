import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const contracts = readFileSync(new URL('../../docs/frontend/integration-contracts.md', import.meta.url), 'utf8')
const pagesAndRoutes = readFileSync(new URL('../../docs/frontend/pages-and-routes.md', import.meta.url), 'utf8')
const frontend = readFileSync(new URL('../../docs/frontend/frontend.md', import.meta.url), 'utf8')

test('authenticated initialization consistently uses GET user-data with bearer auth and no request body', () => {
  assert.match(contracts, /### Get user data/)
  assert.match(contracts, /GET \/api\/v1\/user\/data HTTP\/1\.1/)
  assert.match(contracts, /Authorization: Bearer <accessToken>/)
  assert.match(contracts, /The request has no JSON body/)
  assert.doesNotMatch(contracts, /progressSummary/)
  for (const sessionId of ['session_123', 'session_122', 'session_121']) {
    assert.match(contracts, new RegExp(`"id": "${sessionId}"`))
  }

  for (const source of [contracts, pagesAndRoutes, frontend]) {
    assert.doesNotMatch(source, /\/api\/v1\/users\/me\/application-data/)
    assert.doesNotMatch(source, /\/api\/v1\/user-data/)
  }
})

test('GET user-data includes the supported personal information fields and current PATCH endpoint', () => {
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

  assert.deepEqual(Object.keys(getResponse.personalInformation), canonicalFields)
  assert.match(contracts, /- `PATCH \/api\/v1\/user\/personal-information`/)
})

test('every documented user PATCH endpoint includes its request body fields', () => {
  const expectedFieldsByEndpoint = new Map([
    ['/api/v1/user/personal-information', ['firstName', 'lastName', 'username', 'displayName', 'email', 'phoneCountryCode', 'phone', 'dateOfBirth', 'country', 'city', 'bio']],
    ['/api/v1/user/preferences/notifications', ['trainingReminders', 'sessionSummaries', 'weeklyProgress', 'productUpdates', 'notificationChannel', 'reminderTime']],
    ['/api/v1/user/preferences/privacy', ['saveVideos', 'videoRetention', 'historyVisibility', 'performanceAnalytics', 'optionalTelemetry']],
    ['/api/v1/user/save-password', ['currentPassword', 'newPassword']],
  ])

  for (const [endpoint, expectedFields] of expectedFieldsByEndpoint) {
    const marker = `- \`PATCH ${endpoint}\``
    const start = contracts.indexOf(marker)
    assert.notEqual(start, -1, `${endpoint} is documented`)
    const nextEndpoint = contracts.indexOf('\n- `', start + marker.length)
    const section = contracts.slice(start, nextEndpoint === -1 ? contracts.length : nextEndpoint)
    const match = section.match(/— request body:\s*```json\s*([\s\S]*?)```/)
    assert.ok(match, `${endpoint} request body example is present`)
    assert.deepEqual(Object.keys(JSON.parse(match[1])), expectedFields)
  }

  assert.match(contracts, /confirmPassword.*not transmitted/)
})

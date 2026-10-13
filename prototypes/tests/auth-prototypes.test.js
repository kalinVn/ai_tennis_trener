import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const read = path => readFileSync(new URL(path, root), 'utf8')

test('dedicated authentication pages and forms expose the required controls', () => {
  for (const path of [
    'pages/LoginPage.vue',
    'pages/RegisterPage.vue',
    'components/forms/LoginForm.vue',
    'components/forms/RegisterForm.vue',
    'components/forms/SocialAuthButton.vue',
    'components/forms/SocialAuthButtons.vue',
    'components/fields/RecaptchaField.vue',
    'design/components/fields/recaptcha-field.html',
    'design/components/buttons/social-auth-buttons.html',
    'design/pages/login.html',
    'design/pages/register.html',
  ]) assert.ok(existsSync(new URL(path, root)), `${path} should exist`)

  const login = read('components/forms/LoginForm.vue')
  for (const value of [
    'type="email"',
    'type="password"',
    'SocialAuthButtons',
    'RecaptchaField',
    'v-model="recaptchaVerified"',
    'registerHref',
  ]) assert.match(login, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))

  const loginHtml = read('design/pages/login.html')
  assert.match(loginHtml, /<form\b/)
  assert.match(loginHtml, /type="email"/)
  assert.match(loginHtml, /type="password"/)
  assert.match(loginHtml, /name="recaptcha_confirmation"/)
  assert.match(loginHtml, /I'm not a robot/)
  assert.equal((loginHtml.match(/<svg /g) ?? []).length, 3)

  const register = read('components/forms/RegisterForm.vue')
  for (const value of [
    'first_name',
    'last_name',
    'type="email"',
    'type="tel"',
    'name="password"',
    'name="confirm_password"',
    'type="checkbox"',
    'RecaptchaField',
    'v-model="recaptchaVerified"',
    'SocialAuthButtons',
    'v-model="legalConsentAccepted"',
    'loginHref',
  ]) assert.match(register, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))

  const registerHtml = read('design/pages/register.html')
  assert.match(registerHtml, /<form\b/)
  for (const value of ['first_name', 'last_name', 'type="email"', 'type="tel"', 'name="password"', 'name="confirm_password"', 'type="checkbox"']) {
    assert.match(registerHtml, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
  assert.match(registerHtml, /name="recaptcha_confirmation"/)
  assert.match(registerHtml, /I'm not a robot/)
  for (const label of ['Continue with Google', 'Continue with Facebook', 'Continue with Apple']) assert.match(registerHtml, new RegExp(label))
  assert.equal((registerHtml.match(/<svg /g) ?? []).length, 3)

  const socialButton = read('components/forms/SocialAuthButton.vue')
  for (const prop of ['provider', 'actionLabel', 'disabled', 'loading']) assert.match(socialButton, new RegExp(prop))
  assert.match(socialButton, /\['google', 'facebook', 'apple'\]/)
  assert.match(socialButton, /defineEmits\(\['click'\]\)/)

  const socialButtons = read('components/forms/SocialAuthButtons.vue')
  assert.match(socialButtons, /pendingProvider/)
  assert.match(socialButtons, /SocialAuthButton/)
  assert.match(socialButtons, /defineEmits\(\['select'\]\)/)

  const recaptcha = read('components/fields/RecaptchaField.vue')
  assert.match(recaptcha, /defineEmits\(\['update:modelValue'\]\)/)
  assert.match(recaptcha, /name="recaptcha_confirmation"/)
  assert.match(recaptcha, /type="checkbox"/)
  assert.match(recaptcha, /provider token verified by the backend/)

  const routes = read('../docs/frontend/pages-and-routes.md')
  const placements = routes.match(/`RecaptchaField`/g) ?? []
  assert.ok(placements.length >= 2)

  const contracts = read('../docs/frontend/integration-contracts.md')
  assert.match(contracts, /POST \/api\/v1\/auth\/register/)
  for (const field of ['firstName', 'lastName', 'email', 'phone', 'password', 'legalConsent', 'recaptchaToken']) {
    assert.match(contracts, new RegExp(`"${field}"`))
  }
  assert.match(contracts, /201 Created/)
  assert.match(contracts, /"status": "verification_required"/)
  assert.match(contracts, /confirmPassword.*not transmitted/)
  assert.match(contracts, /POST \/api\/v1\/auth\/oauth\/\{provider\}\/start/)
  assert.match(contracts, /GET \/api\/v1\/auth\/oauth\/\{provider\}\/callback/)
  for (const provider of ['google', 'facebook', 'apple']) assert.match(contracts, new RegExp(`\\b${provider}\\b`))

  const loginIndex = contracts.indexOf('POST /api/v1/auth/login')
  const refreshIndex = contracts.indexOf('POST /api/v1/auth/refresh')
  const logoutIndex = contracts.indexOf('POST /api/v1/auth/logout')
  const registerIndex = contracts.indexOf('POST /api/v1/auth/register')
  assert.ok(loginIndex < refreshIndex && refreshIndex < logoutIndex && logoutIndex < registerIndex)
  assert.equal(contracts.match(/- `POST \/api\/v1\/auth\/refresh`/g)?.length, 1)
  assert.equal(contracts.match(/- `POST \/api\/v1\/auth\/logout`/g)?.length, 1)
  assert.match(contracts, /"method": "totp"/)
  assert.match(contracts, /"code": "123456"/)
  assert.match(contracts, /POST \/api\/v1\/auth\/refresh HTTP\/1\.1/)
  assert.match(contracts, /POST \/api\/v1\/auth\/logout HTTP\/1\.1/)
  assert.match(contracts, /Cookie: refresh_token=/)
  assert.match(contracts, /X-CSRF-Token:/)
  assert.match(contracts, /HTTP\/1\.1 200 OK/)
  assert.match(contracts, /HTTP\/1\.1 204 No Content/)
  assert.match(contracts, /Content-Length: 0/)
  assert.match(contracts, /Set-Cookie: refresh_token=/)
  assert.match(contracts, /204 No Content.*intentionally has no JSON body/)
})

test('public authentication navigation targets dedicated prototype pages', () => {
  for (const path of [
    'design/pages/index.html',
    'design/pages/features.html',
    'design/pages/not-found.html',
    'design/layouts/public.html',
    'design/components/navigation.html',
  ]) {
    const source = read(path)
    assert.doesNotMatch(source, /openAuth\(|setAuth\(/, path)
    assert.match(source, /login\.html/, path)
    assert.match(source, /register\.html/, path)
    assert.doesNotMatch(source, /href="[^"\n]*pricing\.html"/, path)
  }
})

test('authenticated navigation omits the removed Pricing page', () => {
  assert.equal(existsSync(new URL('../design/pages/pricing.html', import.meta.url)), false)
  const authenticatedNavigation = read('design/components/navigation/authenticated-navigation.html')
  assert.doesNotMatch(authenticatedNavigation, /pricing/i)
  assert.match(authenticatedNavigation, /subscription\/subscription\.html/)
  assert.match(authenticatedNavigation, /checkout\/checkout\.html/)
  assert.doesNotMatch(authenticatedNavigation, /\/progress/)
})

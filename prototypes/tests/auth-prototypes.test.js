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
    'design/pages/login.html',
    'design/pages/register.html',
  ]) assert.ok(existsSync(new URL(path, root)), `${path} should exist`)

  const login = read('components/forms/LoginForm.vue')
  for (const value of [
    'type="email"',
    'type="password"',
    'Login with Google',
    'Login with Facebook',
    'Login with Apple',
    'registerHref',
  ]) assert.match(login, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  assert.equal((login.match(/<svg /g) ?? []).length, 3)

  const loginHtml = read('design/pages/login.html')
  assert.match(loginHtml, /<form\b/)
  assert.match(loginHtml, /type="email"/)
  assert.match(loginHtml, /type="password"/)
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
    'loginHref',
  ]) assert.match(register, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))

  const registerHtml = read('design/pages/register.html')
  assert.match(registerHtml, /<form\b/)
  for (const value of ['first_name', 'last_name', 'type="email"', 'type="tel"', 'name="password"', 'name="confirm_password"', 'type="checkbox"']) {
    assert.match(registerHtml, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  }
})

test('public authentication navigation targets dedicated prototype pages', () => {
  for (const path of [
    'design/pages/index.html',
    'design/pages/features.html',
    'design/pages/pricing.html',
    'design/pages/not-found.html',
    'design/layouts/public.html',
    'design/components/navigation.html',
  ]) {
    const source = read(path)
    assert.doesNotMatch(source, /openAuth\(|setAuth\(/, path)
    assert.match(source, /login\.html/, path)
    assert.match(source, /register\.html/, path)
  }
})

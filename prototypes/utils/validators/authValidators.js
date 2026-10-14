const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+[1-9]\d{7,14}$/

function required(value, label) {
  return String(value ?? '').trim() ? '' : `${label} is required.`
}

function normalizedPhone(value) {
  return String(value ?? '').replace(/[\s()-]/g, '')
}

export function validateLogin(values) {
  const errors = {
    email: required(values.email, 'Email'),
    password: required(values.password, 'Password'),
    recaptcha: values.recaptchaVerified ? '' : 'Complete the reCAPTCHA check before logging in.',
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function validateRegistration(values) {
  const errors = {
    firstName: required(values.firstName, 'First name'),
    lastName: required(values.lastName, 'Surname'),
    email: required(values.email, 'Email'),
    phone: required(values.phone, 'Phone'),
    password: required(values.password, 'Password'),
    confirmPassword: required(values.confirmPassword, 'Password confirmation'),
    legalConsent: values.legalConsentAccepted ? '' : 'Accept the Terms of Service and Privacy Policy.',
    recaptcha: values.recaptchaVerified ? '' : 'Complete the reCAPTCHA check before creating an account.',
  }

  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.'
  }
  if (!errors.phone && !PHONE_PATTERN.test(normalizedPhone(values.phone))) {
    errors.phone = 'Enter a valid international phone number.'
  }
  if (!errors.password && values.password.length < 12) {
    errors.password = 'Password must be at least 12 characters.'
  }
  if (!errors.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match.'
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.values(errors).some(Boolean)
}

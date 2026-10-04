// Demonstrates the service boundary only. No network or credential storage.
export async function submitDemoAuth(mode) {
  if (!['login', 'register'].includes(mode)) {
    throw new Error('Unsupported demo operation')
  }
  return {
    message: mode === 'login'
      ? 'Demo complete. You are not authenticated.'
      : 'Demo complete. No account was created.',
  }
}

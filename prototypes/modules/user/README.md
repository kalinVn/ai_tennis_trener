# User module prototype

Small Vue 3 JavaScript code example, not a standalone application or production authentication implementation.

```text
user/
  pages/
    LoginPage.vue
    RegisterPage.vue
  components/
    AuthForm.vue
  stores/
    useAuthStore.js
  services/
    demoAuthService.js
```

Pages select login or registration mode in the module's Pinia store. The form reads state and invokes actions directly from that store, without passing form state through props or forwarding submit events. The store calls the demo service. Vue files contain templates and minimal script wiring.

The host Vue application must install Pinia once with createPinia. Render one authentication page at a time. Form state is reset when leaving the form; passwords must never be persisted or logged. This demo clears the password before calling its credential-free service. The revision counter ignores stale results after switching pages. Generic reusable UI components may still use props; this example does not require all local UI state to become global.

AuthForm belongs here because it is specific to this module. General-purpose buttons and shared composables belong outside the module in the application's shared folders; native HTML buttons keep this example small. Do not create unused folders.

The demo service does not contact a server, store credentials, create an account, or authenticate anyone. Real integration requires documented API contracts and server-side validation and authorization. No routes or application bootstrap are included. Import these pages into an existing Vue application to render them.

Use this as an organization example, not a requirement to add authentication to every project or copy these fields into every module.

# Frontend Subscription UI

## Purpose

Build subscription and billing interfaces.

## Support UI for:

- current plan
- subscription status
- renewal date
- available plans
- upgrade
- downgrade where supported
- cancel/manage subscription
- payment actions
- billing state

Prepare for Stripe integration.

Never place Stripe secret keys or server-side payment logic in frontend code.

Use backend endpoints for privileged billing operations.
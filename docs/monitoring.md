# Monitoring & Analytics

The template ships a tiny, vendor-neutral adapter in
[`src/shared/lib/monitoring.ts`](../src/shared/lib/monitoring.ts):

```ts
captureError(error, { source: 'react-error-boundary' })
captureEvent('Project Created', { plan: 'free' })
```

By default both functions are no-ops. This keeps the starter dependency-free
and lets each project choose Sentry, PostHog, Plausible, or another provider
when it needs one.

## Built-in capture points

- [`src/widgets/main-layout`](../src/widgets/main-layout) captures errors thrown
  by route views through the route-level error boundary.
- [`src/app/error-fallback.tsx`](../src/app/error-fallback.tsx) captures errors
  that escape to the top-level boundary.
- [`src/shared/api/client.ts`](../src/shared/api/client.ts) captures rejected
  Axios responses before rethrowing them. The capture context includes the
  request method, URL, and response status when Axios provides them.

## Environment slots

`.env.example` includes placeholders only:

```txt
VITE_SENTRY_DSN=
VITE_ANALYTICS_KEY=
```

They are parsed by [`src/shared/config/env.ts`](../src/shared/config/env.ts) as
`env.sentryDsn` and `env.analyticsKey`, but no SDK reads them until a project
registers a real monitoring adapter.

## Sentry example

Install Sentry in the app project:

```bash
npm install @sentry/react
```

Register it during startup, for example from `src/app/providers.tsx` or a
dedicated `src/app/init-monitoring.ts` imported by `src/main.tsx`:

```ts
import * as Sentry from '@sentry/react'

import { env } from '@/shared/config'
import { registerMonitoring } from '@/shared/lib'

if (env.sentryDsn) {
  Sentry.init({ dsn: env.sentryDsn })

  registerMonitoring({
    captureError(error, options) {
      Sentry.captureException(error, {
        tags: { source: options?.source },
        extra: options?.context,
      })
    },
    captureEvent(name, props) {
      Sentry.addBreadcrumb({ category: 'event', message: name, data: props })
    },
  })
}
```

## PostHog example

Install PostHog and use `VITE_ANALYTICS_KEY`:

```bash
npm install posthog-js
```

```ts
import posthog from 'posthog-js'

import { env } from '@/shared/config'
import { registerMonitoring } from '@/shared/lib'

if (env.analyticsKey) {
  posthog.init(env.analyticsKey, { api_host: 'https://app.posthog.com' })

  registerMonitoring({
    captureError(error, options) {
      posthog.capture('App Error', {
        source: options?.source,
        message: error instanceof Error ? error.message : String(error),
        ...options?.context,
      })
    },
    captureEvent(name, props) {
      posthog.capture(name, props)
    },
  })
}
```

## Plausible example

Plausible is event-focused. Use `captureEvent` for analytics events and keep
errors no-op or forward them to a separate error tool:

```ts
import { registerMonitoring } from '@/shared/lib'

declare global {
  interface Window {
    plausible?: (name: string, options?: { props?: Record<string, unknown> }) => void
  }
}

registerMonitoring({
  captureError() {},
  captureEvent(name, props) {
    window.plausible?.(name, { props })
  },
})
```

## Testing

Tests can register a spy adapter and reset it afterward:

```ts
import { registerMonitoring, resetMonitoring } from '@/shared/lib/monitoring'

const captureError = vi.fn()
registerMonitoring({ captureError, captureEvent: vi.fn() })

// ...

resetMonitoring()
```

# Testing

This template uses [Vitest](https://vitest.dev/) for unit and integration
tests, [Testing Library](https://testing-library.com/) for component
assertions, and [MSW](https://mswjs.io/) for HTTP mocking. Tests live next
to the code they cover (`foo.test.tsx` beside `foo.tsx`).

## Run the suite

```bash
npm run test          # watch mode
npm run test:run      # single pass (used in CI)
npm run test:coverage # single pass + v8 coverage report under coverage/
```

The coverage step writes a text summary to the terminal and an HTML report
to `coverage/index.html`. Coverage is **off by default** — opt in with the
script above. Tune thresholds in `vitest.config.ts` if you want CI to fail
when coverage regresses.

## Test utilities

`renderWithProviders` (from `@/test/test-utils`) wraps the rendered tree in
the same providers the real app uses (i18n, React Query, router), so most
component tests should reach for it instead of bare `render`.

```tsx
import { renderWithProviders, screen } from '@/test/test-utils'

renderWithProviders(<MyComponent />, { route: '/dashboard' })
expect(screen.getByRole('heading')).toBeInTheDocument()
```

## HTTP mocking with MSW

The default test setup boots an MSW server (`src/test/msw/server.ts`)
before the suite and resets handlers between tests. Default handlers live
in `src/test/msw/handlers.ts`. Unhandled requests **fail loudly** so you
notice when a feature talks to the network unexpectedly.

Override a handler inside a single test with `server.use(...)`:

```ts
import { http, HttpResponse } from 'msw'
import { server } from '@/test/msw/server'

server.use(
  http.post('/api/auth/login', () =>
    HttpResponse.json({ message: 'Account locked' }, { status: 423 }),
  ),
)
```

The `LoginForm` test in `src/features/auth/ui/login-form.test.tsx` is the
canonical example: success uses the default handler, the error case
overrides it for one assertion.

### Adding a new handler

1. Add the handler to `src/test/msw/handlers.ts` (or a sibling file
   re-exported from there).
2. Use the `endpoint()` helper so the same handler works against the
   tests' relative `/api` base URL and any real URL set via
   `VITE_API_BASE_URL` in dev.
3. Add the success case here; keep ad-hoc error scenarios in the test
   that needs them via `server.use(...)`.

## Mocking the browser too (`VITE_ENABLE_MSW`)

The same handlers can run in the dev server, so you can build the UI
before a backend exists.

```bash
echo 'VITE_ENABLE_MSW=true' >> .env.local
npm run dev
```

`src/main.tsx` checks the flag and, in dev only, starts the MSW worker
(`public/mockServiceWorker.js`) before rendering. The check is a dynamic
import, so the worker code never lands in a production bundle. Production
builds ignore the flag.

To stop using MSW, unset the variable (or remove `.env.local`) and restart
the dev server.

## End-to-end tests (Playwright)

The template **does not** install Playwright — the runtime is heavy and
most projects already have CI-specific E2E requirements. When you need
E2E, [Playwright](https://playwright.dev/) is the recommended option:

```bash
npm init playwright@latest
```

Keep specs under `e2e/` (outside `src/`) so Vitest's `include` glob does
not pick them up, and run them as a separate CI job. Reuse the MSW
handlers for backend-free smoke tests by starting the dev server with
`VITE_ENABLE_MSW=true` before the Playwright run.

## What we deliberately left out

- **Storybook / interaction tests** — the `ui-kit` view doubles as a
  live demo of every primitive. Add Storybook later if the design system
  outgrows it.
- **Snapshot tests** — they drift quietly and hide real regressions.
  Prefer explicit role/text assertions.

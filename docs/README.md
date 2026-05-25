# Template Docs

Per-feature usage guides for the React Template. Each doc covers what
ships in the template, how to extend it, and the opt-out path (when one
exists).

## Index

- [i18n & RTL](i18n.md) — translations, language switcher, `useDirection()`,
  and the `--no-i18n` opt-out.
- [Routing & Layout](routing-and-layout.md) — lazy routes, error boundaries,
  `ScrollToTop`, `<RoleGuard>`, breadcrumbs, `/session-expired`, layout
  presets, and responsive navigation.
- [API & Data Layer](api-and-data.md) — Axios interceptors, `parseApiError`,
  React Query defaults, query-key factory pattern, and `useApiMutation`.
- [Build & Performance](build-and-performance.md) — SVG-as-component
  imports, `build:analyze` visualizer, vendor chunk pinning, the
  bundle-size budget, and the opt-in PWA setup.
- [Testing](testing.md) — Vitest, Testing Library, MSW for tests and
  dev, coverage, and the Playwright recommendation for E2E.
- [Monitoring & Analytics](monitoring.md) — no-op capture helpers,
  error-boundary / Axios wiring, and vendor swap-in examples.
- [CI/CD](ci-cd.md) — the CI pipeline, CodeQL scanning, and the
  parked deploy template for Vercel / Netlify / GitHub Pages.

> Each phase that ships a user-facing feature should add a short page
> here. See the "Docs as we go" rule in
> [React_template_followup_phases.md](../React_template_followup_phases.md#cross-cutting-cleanup-items).

# Template Docs

Per-feature usage guides for the React Template. Each doc covers what
ships in the template, how to extend it, and the opt-out path (when one
exists).

## Index

- [i18n & RTL](i18n.md) — translations, language switcher, `useDirection()`,
  and the `--no-i18n` opt-out.
- [Routing & Layout](routing-and-layout.md) — lazy routes, error boundaries,
  `ScrollToTop`, `<RoleGuard>`, breadcrumbs, `/session-expired`, and the
  responsive sidebar.
- [API & Data Layer](api-and-data.md) — Axios interceptors, `parseApiError`,
  React Query defaults, query-key factory pattern, and `useApiMutation`.

> Each phase that ships a user-facing feature should add a short page
> here. See the "Docs as we go" rule in
> [React_template_followup_phases.md](../React_template_followup_phases.md#cross-cutting-cleanup-items).

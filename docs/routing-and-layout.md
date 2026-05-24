# Routing & Layout

The template ships with a route tree built on
[react-router-dom](https://reactrouter.com/), code-split per view via
`React.lazy`, error boundaries at both the app and route level, a
breadcrumbs widget, a `RoleGuard` for role-based access, an explicit
`/session-expired` route for the 401 interceptor, and a dashboard
layout that collapses to a side sheet below `md`.

## Where things live

```
src/app/
├── App.tsx               # Top-level <ErrorBoundary> + <RouterProvider>
├── router.tsx            # Route tree, all views lazy-loaded
└── providers.tsx         # Theme / i18n / direction / query providers

src/widgets/
├── main-layout/          # Navbar + <ScrollToTop/> + <ErrorBoundary>+<Suspense>
├── dashboard-layout/     # Two-pane sidebar shell, collapses below md
└── breadcrumbs/          # Trail driven by ROUTE_LABELS

src/features/auth/ui/
├── protected-route.tsx   # Auth gate — redirects to /login if signed out
└── role-guard.tsx        # Authz gate — redirects to fallback if missing role

src/views/error/          # Fallback view used by both boundaries
src/views/session-expired # /session-expired landing for the 401 flow

src/shared/lib/scroll-to-top.tsx
src/shared/config/routes.ts     # ROUTES + ROUTE_LABELS
```

## Adding a new route

1. Drop the view at `src/views/<name>/ui/<name>-view.tsx` and re-export
   it from `src/views/<name>/index.ts` and `src/views/index.ts`.
2. Add a path constant to `ROUTES` in
   [src/shared/config/routes.ts](../src/shared/config/routes.ts).
3. Add a label key to `ROUTE_LABELS` in the same file so the
   breadcrumbs render a readable name. Add the matching i18n key to
   `src/shared/i18n/en.json` and any other locales.
4. In [src/app/router.tsx](../src/app/router.tsx), add a `lazy()` import
   and a route entry. Decide whether it lives under the
   `<MainLayout>` (default) or inside the protected dashboard branch:

   ```tsx
   const ReportsView = lazy(() =>
     import('@/views/reports').then((m) => ({ default: m.ReportsView })),
   )

   // …inside the children array:
   { path: 'reports', element: <ReportsView /> }
   ```

The route's chunk shows up in the network tab the first time the user
visits the path — the initial bundle stays small.

## Suspense & error boundaries

`MainLayout` already wraps `<Outlet />` in:

```tsx
<ErrorBoundary key={pathname} FallbackComponent={RouteErrorFallback}>
  <Suspense fallback={<RouteSuspenseFallback />}>
    <Outlet />
  </Suspense>
</ErrorBoundary>
```

The boundary key resets on every pathname change so a fixed bug doesn't
leave the user stuck on the fallback after they navigate away. The
fallback component is the same `ErrorView` shipped at
`src/views/error/` — reuse it directly or render your own per-route
fallback by wrapping the route element in another `<ErrorBoundary>`.

There's also a top-level `<ErrorBoundary>` in
[src/app/App.tsx](../src/app/App.tsx) that catches errors which escape
the router itself (e.g. provider init failures).

## Auth & roles

- `<ProtectedRoute>` (existing) redirects unauthenticated users to
  `/login`, preserving `from` in `location.state` so the login view can
  send them back.
- `<RoleGuard roles={['admin']}>` checks the signed-in user's `roles`
  array. Place it _inside_ `<ProtectedRoute>` so the gate isn't doing
  double work:

  ```tsx
  {
    path: 'admin',
    element: (
      <ProtectedRoute>
        <RoleGuard roles={['admin']}>
          <AdminLayout />
        </RoleGuard>
      </ProtectedRoute>
    ),
  }
  ```

  If the user is signed in but missing the role, they're sent to
  `fallbackTo` (defaults to `/`).

The user type lives at [entities/user/model/user.types.ts](../src/entities/user/model/user.types.ts).
It carries both `role` (primary, singular) and `roles` (full set used
by the guard). The mock login response returns `['admin', 'user']` for
the demo user — swap that out for real role data from your backend.

## Session expiry

The Axios client's 401 interceptor (see
[docs/api-data-layer.md](api-data-layer.md) when Phase 18 lands its
docs) clears the auth store and navigates to `/session-expired`, which
renders a friendly view with a "Sign in" link. The route itself lives
under `MainLayout`, so the navbar stays visible.

## Breadcrumbs

Mount `<Breadcrumbs />` anywhere inside a layout — it reads the current
pathname and renders a trail. `DashboardLayout` already includes it at
the top of the content pane.

Labels come from `ROUTE_LABELS` in
[src/shared/config/routes.ts](../src/shared/config/routes.ts). Unknown
segments fall back to a humanized version of the slug (`"my-page"` →
`"My Page"`). The current crumb is rendered as plain text with
`aria-current="page"`; previous crumbs are links.

## ScrollToTop

`<ScrollToTop />` is mounted once in `MainLayout`. It scrolls back to
top whenever the pathname changes — except when the URL has a `#hash`,
where the browser's anchor behavior wins. If you need a different
strategy for a specific view (e.g. restore the previous scroll
position), do it inline; the global one is opt-out by removing the
component.

## Responsive sidebar (`< md`)

`DashboardLayout` swaps the inline sidebar for a side sheet below the
`md` breakpoint (768 px):

- A "Navigation" button appears in the topbar.
- Tapping it opens a Radix Dialog repositioned to slide in from the
  start side (left in LTR, right in RTL).
- Navigating closes the drawer automatically (the layout watches
  `location.pathname`).

The breakpoint matches Phase 26's layout convention — see
[docs/responsive.md](responsive.md) when that phase lands its docs.

## Testing routed components

`renderWithProviders` in
[src/test/test-utils.tsx](../src/test/test-utils.tsx) accepts a `route`
option that drives the `MemoryRouter` initial entry, and the wrapper
includes the i18n provider. For role-guarded components, seed the
auth store before rendering:

```tsx
useAuthStore.getState().setSession({
  accessToken: 'mock',
  user: {
    id: 'u1',
    name: 'Tester',
    email: 't@example.com',
    role: 'admin',
    roles: ['admin'],
  },
})

renderWithProviders(<AdminPage />, { route: '/admin' })
```

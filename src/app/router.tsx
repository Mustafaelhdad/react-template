/* eslint-disable react-refresh/only-export-components --
 * The router file mixes the route tree (a non-component export) with
 * lazy() component declarations. That's structural — moving the lazy
 * declarations to a separate file would just shuffle the same problem
 * around. Fast refresh isn't meaningful in this file anyway.
 */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/features/auth'
import { LAYOUT } from '@/shared/config'
import { ErrorView } from '@/views/error'
import { MainLayout } from '@/widgets/main-layout'

// Each view is loaded on demand so the initial bundle stays lean — the
// network tab should show one chunk per route the first time the user
// visits it. `lazy()` requires a default export, so we adapt the named
// exports inline.
//
// `ErrorView` is the exception: it backs the error boundaries in
// `MainLayout` and `ErrorFallback`, which must render synchronously when
// something throws — they can't `await` an import mid-error. Those static
// importers pin it to the initial chunk regardless, so wrapping it in
// `lazy()` here would just stall the `/error` route behind a suspense
// boundary for code that's already loaded (and emit Rollup's
// INEFFECTIVE_DYNAMIC_IMPORT warning).
const HomeView = lazy(() => import('@/views/home').then((m) => ({ default: m.HomeView })))
const LoginView = lazy(() =>
  import('@/views/login').then((m) => ({ default: m.LoginView })),
)
const UiKitView = lazy(() =>
  import('@/views/ui-kit').then((m) => ({ default: m.UiKitView })),
)
const NotFoundView = lazy(() =>
  import('@/views/not-found').then((m) => ({ default: m.NotFoundView })),
)
const SessionExpiredView = lazy(() =>
  import('@/views/session-expired').then((m) => ({ default: m.SessionExpiredView })),
)
const MarketingLayout = lazy(() =>
  import('@/widgets/marketing-layout').then((m) => ({ default: m.MarketingLayout })),
)
const DashboardSidebarLayout = lazy(() =>
  import('@/widgets/dashboard-sidebar-layout').then((m) => ({
    default: m.DashboardSidebarLayout,
  })),
)
const DashboardTopnavLayout = lazy(() =>
  import('@/widgets/dashboard-topnav-layout').then((m) => ({
    default: m.DashboardTopnavLayout,
  })),
)
const DashboardView = lazy(() =>
  import('@/views/dashboard').then((m) => ({ default: m.DashboardView })),
)

function ActiveLayoutRoute({ protectedRoute = false }: { protectedRoute?: boolean }) {
  const layout =
    LAYOUT === 'marketing' ? (
      <MarketingLayout />
    ) : LAYOUT === 'dashboard-topnav' ? (
      <DashboardTopnavLayout />
    ) : (
      <DashboardSidebarLayout />
    )

  if (protectedRoute && LAYOUT !== 'marketing') {
    return <ProtectedRoute>{layout}</ProtectedRoute>
  }

  return layout
}

const protectedDashboardRoutes =
  LAYOUT === 'marketing'
    ? []
    : [
        {
          path: 'dashboard',
          element: <DashboardView />,
        },
      ]

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <MarketingLayout />,
        children: [
          {
            index: true,
            element: <HomeView />,
          },
          {
            path: 'login',
            element: <LoginView />,
          },
          {
            path: 'session-expired',
            element: <SessionExpiredView />,
          },
          {
            path: 'error',
            element: <ErrorView />,
          },
          {
            path: '*',
            element: <NotFoundView />,
          },
        ],
      },
      {
        element: <ActiveLayoutRoute />,
        children: [
          {
            path: 'ui-kit',
            element: <UiKitView />,
          },
        ],
      },
      ...(protectedDashboardRoutes.length > 0
        ? [
            {
              element: <ActiveLayoutRoute protectedRoute />,
              children: protectedDashboardRoutes,
            },
          ]
        : []),
    ],
  },
])

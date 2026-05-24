/* eslint-disable react-refresh/only-export-components --
 * The router file mixes the route tree (a non-component export) with
 * lazy() component declarations. That's structural — moving the lazy
 * declarations to a separate file would just shuffle the same problem
 * around. Fast refresh isn't meaningful in this file anyway.
 */
import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/features/auth'
import { MainLayout } from '@/widgets/main-layout'

// Each view is loaded on demand so the initial bundle stays lean — the
// network tab should show one chunk per route the first time the user
// visits it. `lazy()` requires a default export, so we adapt the named
// exports inline.
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
const DashboardLayout = lazy(() =>
  import('@/widgets/dashboard-layout').then((m) => ({ default: m.DashboardLayout })),
)
const DashboardView = lazy(() =>
  import('@/views/dashboard').then((m) => ({ default: m.DashboardView })),
)

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
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
        path: 'ui-kit',
        element: <UiKitView />,
      },
      {
        path: 'session-expired',
        element: <SessionExpiredView />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardView />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundView />,
      },
    ],
  },
])

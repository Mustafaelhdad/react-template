import { createBrowserRouter } from 'react-router-dom'

import { ProtectedRoute } from '@/features/auth'
import { DashboardView } from '@/views/dashboard'
import { HomeView } from '@/views/home'
import { LoginView } from '@/views/login'
import { NotFoundView } from '@/views/not-found'
import { DashboardLayout } from '@/widgets/dashboard-layout'
import { MainLayout } from '@/widgets/main-layout'

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

import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

import { useSessionQuery } from '../lib/use-session'
import { useAuthStore } from '../model/auth-store'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Keeps the session fresh in the background without blocking the route —
  // `useSessionQuery` is seeded from the persisted user, so this never
  // introduces a loading state here.
  useSessionQuery()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return children
}

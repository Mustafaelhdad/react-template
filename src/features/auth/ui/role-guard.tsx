import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import type { UserRole } from '@/entities'
import { ROUTES } from '@/shared/config'

import { useAuthStore } from '../model/auth-store'

type RoleGuardProps = {
  /**
   * Roles allowed to render the children. The user passes if any one of
   * their roles is in this list.
   */
  roles: UserRole[]
  children: ReactNode
  /**
   * Where to redirect when the user is signed in but doesn't have the
   * required role. Defaults to the home route.
   */
  fallbackTo?: string
}

/**
 * Authorization gate. Place inside a `<ProtectedRoute>` so unauthenticated
 * users get redirected to login first; this component only worries about
 * whether the signed-in user has the right role.
 */
export function RoleGuard({ roles, children, fallbackTo = ROUTES.home }: RoleGuardProps) {
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  const allowed = user.roles?.some((role) => roles.includes(role)) ?? false

  if (!allowed) {
    return <Navigate to={fallbackTo} replace />
  }

  return <>{children}</>
}

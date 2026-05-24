import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

import { demoSession } from '../model/demo-session'

type ProtectedRouteProps = {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()

  if (!demoSession.isAuthenticated()) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return children
}

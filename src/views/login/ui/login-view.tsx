import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { LoginForm, useAuthStore } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const state = location.state as LoginLocationState | null
  const redirectTo = state?.from?.pathname ?? ROUTES.dashboard

  const handleLoginSuccess = () => {
    navigate(redirectTo, { replace: true })
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl tracking-normal">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to start the mock template session.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <LoginForm onSuccess={handleLoginSuccess} />
      </CardContent>
    </Card>
  )
}

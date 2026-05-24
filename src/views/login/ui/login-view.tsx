import { LogIn } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { demoSession } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { notify } from '@/shared/lib'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui'

type LoginLocationState = {
  from?: {
    pathname?: string
  }
}

export function LoginView() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginLocationState | null
  const redirectTo = state?.from?.pathname ?? ROUTES.dashboard

  const handleDemoLogin = () => {
    demoSession.signIn()
    notify.success('Demo session started')
    navigate(redirectTo, { replace: true })
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl tracking-normal">Sign in</CardTitle>
        <CardDescription>
          Start a temporary demo session to preview the protected dashboard route.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button onClick={handleDemoLogin} className="w-full">
          <LogIn className="size-4" aria-hidden="true" />
          Continue with demo session
        </Button>
      </CardContent>
    </Card>
  )
}

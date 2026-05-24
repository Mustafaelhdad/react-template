import { LogIn } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { demoSession } from '@/features/auth'
import { ROUTES } from '@/shared/config'

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
    toast.success('Demo session started')
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="mx-auto grid max-w-md gap-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">Sign in</h1>
        <p className="text-sm leading-6 text-zinc-600">
          Start a temporary demo session to preview the protected dashboard route.
        </p>
      </div>

      <button
        type="button"
        onClick={handleDemoLogin}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
      >
        <LogIn className="size-4" aria-hidden="true" />
        Continue with demo session
      </button>
    </section>
  )
}

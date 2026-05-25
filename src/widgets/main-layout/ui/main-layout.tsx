import { Suspense, useEffect } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Outlet, useLocation } from 'react-router-dom'

import { captureError, ScrollToTop } from '@/shared/lib'
import { Spinner } from '@/shared/ui'
import { ErrorView } from '@/views/error'

function RouteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    captureError(error, { source: 'react-route-error-boundary' })
  }, [error])

  return <ErrorView error={error} onReset={resetErrorBoundary} />
}

function RouteSuspenseFallback() {
  return (
    <div className="grid place-items-center py-24">
      <Spinner size="lg" />
    </div>
  )
}

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <ScrollToTop />
      {/* Reset on pathname change so a fixed bug doesn't leave the
          boundary stuck after the user navigates away. */}
      <ErrorBoundary key={location.pathname} FallbackComponent={RouteErrorFallback}>
        <Suspense fallback={<RouteSuspenseFallback />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

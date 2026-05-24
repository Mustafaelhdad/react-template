import { Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Outlet, useLocation } from 'react-router-dom'

import { ScrollToTop } from '@/shared/lib'
import { Spinner } from '@/shared/ui'
import { ErrorView } from '@/views/error'
import { Navbar } from '@/widgets/navbar'

function RouteErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
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
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Reset on pathname change so a fixed bug doesn't leave the
            boundary stuck after the user navigates away. */}
        <ErrorBoundary key={location.pathname} FallbackComponent={RouteErrorFallback}>
          <Suspense fallback={<RouteSuspenseFallback />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  )
}

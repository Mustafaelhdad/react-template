import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { RouterProvider } from 'react-router-dom'

import { ErrorView } from '@/views/error'

import './init-api'

import { AppProviders } from './providers'
import { router } from './router'

/**
 * Top-level boundary that catches errors which escape the router (e.g.
 * provider initialization failures). Route-level errors are handled by
 * the inner boundary in <MainLayout />.
 */
function AppErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <ErrorView error={error} onReset={resetErrorBoundary} />
    </div>
  )
}

export function App() {
  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  )
}

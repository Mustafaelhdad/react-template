import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider } from 'react-router-dom'

import './init-api'

import { ErrorFallback } from './error-fallback'
import { AppProviders } from './providers'
import { router } from './router'
import { BreakpointIndicator } from '@/widgets/breakpoint-indicator'

export function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppProviders>
        <RouterProvider router={router} />
        {/* Dev-only helper for Phase 26 responsive checks. Remove this line if
            a project prefers not to show the local breakpoint pill. */}
        <BreakpointIndicator />
      </AppProviders>
    </ErrorBoundary>
  )
}

import { useEffect } from 'react'
import type { FallbackProps } from 'react-error-boundary'

import { captureError } from '@/shared/lib'
import { ErrorView } from '@/views/error'

/**
 * Global fallback rendered by the top-level error boundary in App.tsx.
 * Errors that escape the route-level boundary in MainLayout — typically
 * provider initialization failures — surface here.
 *
 * Kept in `src/app/` because it pairs with the boundary defined in
 * App.tsx; the view it delegates to (`@/views/error`) is also reachable
 * directly via `/error` for explicit navigation.
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    captureError(error, { source: 'react-error-boundary' })
  }, [error])

  return (
    <div className="grid min-h-screen place-items-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <ErrorView error={error} onReset={resetErrorBoundary} />
    </div>
  )
}

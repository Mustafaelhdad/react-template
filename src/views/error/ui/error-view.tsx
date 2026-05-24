import { RotateCcw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { Button, Card, CardContent, buttonVariants } from '@/shared/ui'

type ErrorViewProps = {
  /**
   * The error caught by the boundary. Typed as `unknown` to match
   * `react-error-boundary`'s `FallbackProps` — we narrow to `Error`
   * before reading the message. Undefined when the view is reached
   * via direct navigation (e.g. an explicit `/error` link).
   */
  error?: unknown
  /**
   * Reset handler passed by `react-error-boundary` — re-renders the
   * boundary's children so the failed route can try again.
   */
  onReset?: () => void
}

function getErrorMessage(error: unknown): string | null {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return null
}

export function ErrorView({ error, onReset }: ErrorViewProps) {
  const { t } = useTranslation()
  const message = getErrorMessage(error)

  return (
    <Card className="mx-auto max-w-lg text-center">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {t('error.tag')}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
          {t('error.title')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {t('error.description')}
        </p>
        {message ? (
          <pre className="mt-4 max-h-32 overflow-auto rounded-md bg-zinc-100 px-3 py-2 text-start text-xs text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
            {message}
          </pre>
        ) : null}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onReset ? (
            <Button onClick={onReset}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t('error.retry')}
            </Button>
          ) : null}
          <Link to={ROUTES.home} className={buttonVariants({ variant: 'secondary' })}>
            {t('error.backHome')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

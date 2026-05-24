import type { ComponentProps, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

import { cn } from '@/shared/lib'

import { Button } from './button'

type ErrorStateProps = ComponentProps<'div'> & {
  title?: ReactNode
  description?: ReactNode
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  className,
  title = 'Something went wrong',
  description = 'Please try again. If the problem keeps happening, contact support.',
  onRetry,
  retryLabel = 'Try again',
  ...props
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-md border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/30',
        className,
      )}
      {...props}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-red-900 dark:text-red-100">{title}</p>
        {description ? (
          <p className="text-sm text-red-700 dark:text-red-300">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

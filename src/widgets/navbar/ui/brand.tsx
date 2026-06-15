import { PanelsTopLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { type AppRoute } from '@/shared/config'
import { cn } from '@/shared/lib'

type BrandProps = {
  /** Destination for the brand link — home for marketing, dashboard for app shells. */
  to: AppRoute
  /** Hide the wordmark below the `sm` breakpoint (used by the dense dashboard headers). */
  responsiveLabel?: boolean
  className?: string
}

/**
 * App wordmark used across every header preset. Centralising it here means a
 * logo or name change lands in one place instead of every layout shell.
 */
export function Brand({ to, responsiveLabel = false, className }: BrandProps) {
  const { t } = useTranslation()

  return (
    <Link
      to={to}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50',
        className,
      )}
    >
      <span className="grid size-8 place-items-center rounded-md bg-emerald-600 text-white">
        <PanelsTopLeft className="size-4" aria-hidden="true" />
      </span>
      <span className={responsiveLabel ? 'hidden sm:inline' : undefined}>
        {t('common.appName')}
      </span>
    </Link>
  )
}

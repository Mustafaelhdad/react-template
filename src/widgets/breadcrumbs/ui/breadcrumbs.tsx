import { ChevronRight } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import { ROUTE_LABELS, ROUTES } from '@/shared/config'

function humanize(segment: string) {
  return segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

type Crumb = {
  to: string
  label: string
  isCurrent: boolean
}

function buildCrumbs(pathname: string, t: (key: string) => string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean)
  const home: Crumb = {
    to: ROUTES.home,
    label: t(ROUTE_LABELS[''] ?? 'nav.home'),
    isCurrent: segments.length === 0,
  }
  let acc = ''
  const rest = segments.map<Crumb>((segment, i) => {
    acc += `/${segment}`
    const key = ROUTE_LABELS[segment]
    return {
      to: acc,
      label: key ? t(key) : humanize(segment),
      isCurrent: i === segments.length - 1,
    }
  })
  return [home, ...rest]
}

/**
 * Walks the current URL and renders one crumb per path segment. Labels
 * come from `ROUTE_LABELS` in `shared/config/routes.ts` — add an entry
 * there when you ship a new route. Unknown segments fall back to a
 * titlecased version of the slug.
 *
 * The home crumb is always rendered first. The trailing crumb is the
 * current page and is rendered as plain text, not a link.
 */
export function Breadcrumbs() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const crumbs = useMemo(() => buildCrumbs(pathname, t), [pathname, t])

  // Don't render at the home route — there's nothing to navigate up to.
  if (crumbs.length === 1) return null

  return (
    <nav
      aria-label={t('breadcrumbs.ariaLabel')}
      className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400"
    >
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb.to}>
            <li className="inline-flex items-center">
              {crumb.isCurrent ? (
                <span
                  aria-current="page"
                  className="font-medium text-zinc-950 dark:text-zinc-50"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.to}
                  className="inline-flex min-h-11 items-center rounded-sm px-1 transition-colors hover:text-zinc-950 dark:hover:text-zinc-50"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
            {i < crumbs.length - 1 ? (
              <ChevronRight
                className="size-4 shrink-0 text-zinc-300 rtl:rotate-180 dark:text-zinc-700"
                aria-hidden="true"
              />
            ) : null}
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

import { Home, LayoutDashboard, Sparkles } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { DASHBOARD_NAV_ITEMS, type NavIconKey } from '@/shared/config'
import { cn } from '@/shared/lib'

const icons: Record<NavIconKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  home: Home,
  uiKit: Sparkles,
}

type AppSidebarProps = ComponentProps<'aside'> & {
  collapsed?: boolean
}

export function AppSidebar({ collapsed = false, className, ...props }: AppSidebarProps) {
  const { t } = useTranslation()

  return (
    <aside
      className={cn(
        'w-full rounded-lg border border-zinc-200 bg-white p-3 transition-[width] dark:border-zinc-800 dark:bg-zinc-900',
        collapsed && 'md:w-[72px] md:px-2',
        className,
      )}
      {...props}
    >
      <p
        className={cn(
          'px-3 py-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400',
          collapsed && 'md:sr-only',
        )}
      >
        {t('sidebar.workspace')}
      </p>
      <nav className="mt-2 grid gap-1">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const Icon = icons[item.icon]
          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  collapsed && 'md:justify-center md:px-0',
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
                )
              }
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              <span className={cn(collapsed && 'md:sr-only')}>{t(item.labelKey)}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

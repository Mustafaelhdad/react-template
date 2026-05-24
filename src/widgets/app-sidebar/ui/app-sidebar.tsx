import { Home, LayoutDashboard, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

const items = [
  { key: 'dashboard', to: ROUTES.dashboard, icon: LayoutDashboard, end: true },
  { key: 'home', to: ROUTES.home, icon: Home, end: true },
  { key: 'uiKit', to: ROUTES.uiKit, icon: Sparkles, end: true },
] as const

export function AppSidebar() {
  const { t } = useTranslation()

  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="px-3 py-2 text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {t('sidebar.workspace')}
      </p>
      <nav className="mt-2 grid gap-1">
        {items.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
              ].join(' ')
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {t(`sidebar.${item.key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

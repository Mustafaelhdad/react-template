import { Home, LayoutDashboard, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/shared/config'

const items = [
  { label: 'Overview', to: ROUTES.dashboard, icon: LayoutDashboard },
  { label: 'Home', to: ROUTES.home, icon: Home },
  { label: 'Settings', to: ROUTES.dashboard, icon: Settings },
]

export function AppSidebar() {
  return (
    <aside className="rounded-lg border border-zinc-200 bg-white p-3">
      <p className="px-3 py-2 text-xs font-semibold uppercase text-zinc-500">Workspace</p>
      <nav className="mt-2 grid gap-1">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-emerald-50 text-emerald-800'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
              ].join(' ')
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

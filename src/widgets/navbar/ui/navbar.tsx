import { LayoutDashboard, LogIn, LogOut, PanelsTopLeft } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { demoSession } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { Button, buttonVariants } from '@/shared/ui'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-zinc-950 text-white'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950',
  ].join(' ')

export function Navbar() {
  const navigate = useNavigate()
  const isAuthenticated = demoSession.isAuthenticated()

  const handleSignOut = () => {
    demoSession.signOut()
    navigate(ROUTES.login)
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950"
        >
          <span className="grid size-8 place-items-center rounded-md bg-emerald-600 text-white">
            <PanelsTopLeft className="size-4" aria-hidden="true" />
          </span>
          React Template
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to={ROUTES.home} className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to={ROUTES.dashboard} className={navLinkClass}>
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Dashboard
          </NavLink>
        </nav>

        {isAuthenticated ? (
          <Button variant="secondary" size="sm" onClick={handleSignOut}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        ) : (
          <Link to={ROUTES.login} className={buttonVariants({ size: 'sm' })}>
            <LogIn className="size-4" aria-hidden="true" />
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}

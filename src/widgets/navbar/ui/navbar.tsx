import { LayoutDashboard, LogIn, LogOut, PanelsTopLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { notify } from '@/shared/lib'
import { Button, buttonVariants } from '@/shared/ui'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { ThemeToggle } from '@/widgets/theme-toggle'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
  ].join(' ')

export function Navbar() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleSignOut = () => {
    logout()
    notify.info(t('common.signedOut'))
    navigate(ROUTES.login)
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50"
        >
          <span className="grid size-8 place-items-center rounded-md bg-emerald-600 text-white">
            <PanelsTopLeft className="size-4" aria-hidden="true" />
          </span>
          {t('common.appName')}
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to={ROUTES.home} end className={navLinkClass}>
            {t('nav.home')}
          </NavLink>
          <NavLink to={ROUTES.dashboard} className={navLinkClass}>
            <LayoutDashboard className="size-4" aria-hidden="true" />
            {t('nav.dashboard')}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm font-medium text-zinc-600 sm:inline dark:text-zinc-400">
                {user?.name}
              </span>
              <Button variant="secondary" size="sm" onClick={handleSignOut}>
                <LogOut className="size-4" aria-hidden="true" />
                {t('common.signOut')}
              </Button>
            </>
          ) : (
            <Link to={ROUTES.login} className={buttonVariants({ size: 'sm' })}>
              <LogIn className="size-4" aria-hidden="true" />
              {t('common.signIn')}
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

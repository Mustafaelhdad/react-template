import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  PanelsTopLeft,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'
import { DASHBOARD_NAV_ITEMS, ROUTES, type NavIconKey } from '@/shared/config'
import { cn, notify, useDisclosure } from '@/shared/lib'
import { Button, buttonVariants, Container } from '@/shared/ui'
import { Breadcrumbs } from '@/widgets/breadcrumbs'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { ThemeToggle } from '@/widgets/theme-toggle'

const icons: Record<NavIconKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  home: LayoutDashboard,
  uiKit: Sparkles,
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
  )

function DashboardNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const Icon = icons[item.icon]
        return (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.end}
            className={navLinkClass}
            onClick={onNavigate}
          >
            <Icon className="size-4" aria-hidden="true" />
            {t(item.labelKey)}
          </NavLink>
        )
      })}
    </>
  )
}

export function DashboardTopnavLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const drawer = useDisclosure()
  const { pathname } = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    drawer.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleSignOut = () => {
    logout()
    notify.info(t('common.signedOut'))
    navigate(ROUTES.login)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Container className="flex min-h-16 max-w-screen-2xl items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to={ROUTES.dashboard}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50"
            >
              <span className="grid size-8 place-items-center rounded-md bg-emerald-600 text-white">
                <PanelsTopLeft className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">{t('common.appName')}</span>
            </Link>

            <nav
              className="hidden items-center gap-1 md:flex"
              aria-label={t('nav.dashboardMain')}
            >
              <DashboardNavLinks />
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <>
                {user?.name ? (
                  <span className="hidden max-w-40 truncate text-sm font-medium text-zinc-600 lg:inline dark:text-zinc-400">
                    {user.name}
                  </span>
                ) : null}
                <Button variant="secondary" size="sm" onClick={handleSignOut}>
                  <LogOut className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('common.signOut')}</span>
                </Button>
              </>
            ) : (
              <Link to={ROUTES.login} className={buttonVariants({ size: 'sm' })}>
                <LogIn className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('common.signIn')}</span>
              </Link>
            )}

            <DialogPrimitive.Root open={drawer.isOpen} onOpenChange={drawer.setOpen}>
              <DialogPrimitive.Trigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t('layout.openMenu')}
                >
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              </DialogPrimitive.Trigger>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/70" />
                <DialogPrimitive.Content
                  aria-describedby={undefined}
                  className="fixed inset-y-0 end-0 z-50 grid h-full w-[20rem] max-w-[85vw] grid-rows-[auto_1fr_auto] gap-4 bg-white p-4 shadow-xl border-s border-zinc-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rtl:data-[state=closed]:slide-out-to-left rtl:data-[state=open]:slide-in-from-left dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <DialogPrimitive.Title className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      {t('layout.navigation')}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={t('layout.closeMenu')}
                      >
                        <X className="size-5" aria-hidden="true" />
                      </Button>
                    </DialogPrimitive.Close>
                  </div>

                  <nav className="grid gap-1" aria-label={t('nav.dashboardMain')}>
                    <DashboardNavLinks onNavigate={drawer.close} />
                  </nav>

                  <div className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
          </div>
        </Container>
      </header>

      <Container as="main" className="max-w-screen-2xl flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mb-4">
          <Breadcrumbs />
        </div>
        <Outlet />
      </Container>
    </div>
  )
}

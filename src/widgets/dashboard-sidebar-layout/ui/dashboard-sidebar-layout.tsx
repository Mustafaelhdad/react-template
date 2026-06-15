import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  LogIn,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelsTopLeft,
  X,
} from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/features/auth'
import { ROUTES } from '@/shared/config'
import { cn, notify, useDisclosure } from '@/shared/lib'
import { Button, buttonVariants, Container } from '@/shared/ui'
import { AppSidebar } from '@/widgets/app-sidebar'
import { Breadcrumbs } from '@/widgets/breadcrumbs'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { ThemeToggle } from '@/widgets/theme-toggle'

import { useSidebarStore } from '../model/sidebar-store'

/**
 * Sidebar-dominant dashboard preset:
 *
 * - >= `md`: primary nav is an inline, collapsible left sidebar.
 * - < `md`: primary nav moves into a Radix Dialog side sheet.
 * - The topbar stays thin and carries account, language, and theme controls.
 */
export function DashboardSidebarLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const drawer = useDisclosure()
  const sidebarCollapsed = useSidebarStore((state) => state.collapsed)
  const toggleSidebarCollapsed = useSidebarStore((state) => state.toggleCollapsed)
  const { pathname } = useLocation()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    drawer.close()
    // The disclosure object is stable; we only care about pathname.
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
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              to={ROUTES.dashboard}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-zinc-50"
            >
              <span className="grid size-8 place-items-center rounded-md bg-emerald-600 text-white">
                <PanelsTopLeft className="size-4" aria-hidden="true" />
              </span>
              <span className="hidden sm:inline">{t('common.appName')}</span>
            </Link>

            <DialogPrimitive.Root open={drawer.isOpen} onOpenChange={drawer.setOpen}>
              <DialogPrimitive.Trigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="md:hidden"
                  aria-label={t('layout.openMenu')}
                >
                  <Menu className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('layout.navigation')}</span>
                </Button>
              </DialogPrimitive.Trigger>
              <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/70" />
                <DialogPrimitive.Content
                  aria-describedby={undefined}
                  className="fixed inset-y-0 start-0 z-50 grid h-full w-[18rem] max-w-[85vw] grid-rows-[auto_1fr] gap-4 border-zinc-200 bg-white p-4 shadow-xl border-e data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-right dark:border-zinc-800 dark:bg-zinc-900"
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
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </DialogPrimitive.Close>
                  </div>
                  <AppSidebar />
                </DialogPrimitive.Content>
              </DialogPrimitive.Portal>
            </DialogPrimitive.Root>

            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              aria-label={
                sidebarCollapsed ? t('layout.expandSidebar') : t('layout.collapseSidebar')
              }
              onClick={toggleSidebarCollapsed}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="size-5 rtl:rotate-180" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="size-5 rtl:rotate-180" aria-hidden="true" />
              )}
            </Button>

            <div className="hidden min-w-0 md:block">
              <Breadcrumbs />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
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
          </div>
        </Container>
      </header>

      <Container as="main" className="max-w-screen-2xl flex-1 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 md:hidden">
          <Breadcrumbs />
        </div>

        <div
          className={cn(
            'grid gap-4 lg:gap-6',
            sidebarCollapsed
              ? 'md:grid-cols-[72px_minmax(0,1fr)]'
              : 'md:grid-cols-[240px_minmax(0,1fr)]',
          )}
        >
          <div className="hidden md:block">
            <AppSidebar collapsed={sidebarCollapsed} />
          </div>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </Container>
    </div>
  )
}

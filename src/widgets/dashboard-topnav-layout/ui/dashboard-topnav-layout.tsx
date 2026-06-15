import { LayoutDashboard, Menu, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

import { DASHBOARD_NAV_ITEMS, ROUTES, type NavIconKey } from '@/shared/config'
import { cn, useDisclosure } from '@/shared/lib'
import { Button, Container } from '@/shared/ui'
import { Breadcrumbs } from '@/widgets/breadcrumbs'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { Brand, MobileNavDrawer, NavbarAuthActions } from '@/widgets/navbar'
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
  const drawer = useDisclosure()
  const { pathname } = useLocation()

  useEffect(() => {
    drawer.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Container className="flex min-h-16 max-w-screen-2xl items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Brand to={ROUTES.dashboard} responsiveLabel className="shrink-0" />

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
            <NavbarAuthActions />

            <MobileNavDrawer
              open={drawer.isOpen}
              onOpenChange={drawer.setOpen}
              side="end"
              title={t('layout.navigation')}
              contentClassName="w-[20rem] grid-rows-[auto_1fr_auto]"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t('layout.openMenu')}
                >
                  <Menu className="size-5" aria-hidden="true" />
                </Button>
              }
            >
              <nav className="grid gap-1" aria-label={t('nav.dashboardMain')}>
                <DashboardNavLinks onNavigate={drawer.close} />
              </nav>

              <div className="flex items-center justify-between gap-2 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </MobileNavDrawer>
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

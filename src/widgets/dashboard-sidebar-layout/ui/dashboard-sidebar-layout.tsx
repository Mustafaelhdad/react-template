import { Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { ROUTES } from '@/shared/config'
import { cn, useDisclosure } from '@/shared/lib'
import { Button, Container } from '@/shared/ui'
import { AppSidebar } from '@/widgets/app-sidebar'
import { Breadcrumbs } from '@/widgets/breadcrumbs'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { Brand, MobileNavDrawer, NavbarAuthActions } from '@/widgets/navbar'
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
  const drawer = useDisclosure()
  const sidebarCollapsed = useSidebarStore((state) => state.collapsed)
  const toggleSidebarCollapsed = useSidebarStore((state) => state.toggleCollapsed)
  const { pathname } = useLocation()

  useEffect(() => {
    drawer.close()
    // The disclosure object is stable; we only care about pathname.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Container className="flex min-h-16 max-w-screen-2xl items-center justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Brand to={ROUTES.dashboard} responsiveLabel className="shrink-0" />

            <MobileNavDrawer
              open={drawer.isOpen}
              onOpenChange={drawer.setOpen}
              side="start"
              title={t('layout.navigation')}
              contentClassName="w-[18rem] grid-rows-[auto_1fr]"
              trigger={
                <Button
                  variant="secondary"
                  size="sm"
                  className="md:hidden"
                  aria-label={t('layout.openMenu')}
                >
                  <Menu className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{t('layout.navigation')}</span>
                </Button>
              }
            >
              <AppSidebar />
            </MobileNavDrawer>

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
            <NavbarAuthActions />
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

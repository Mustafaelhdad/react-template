import { Home, LogIn, Menu, PanelsTopLeft, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

import { LAYOUT, MARKETING_NAV_ITEMS, ROUTES, type NavIconKey } from '@/shared/config'
import { cn, useDisclosure } from '@/shared/lib'
import { Button, buttonVariants, Container } from '@/shared/ui'
import { LanguageSwitcher } from '@/widgets/language-switcher'
import { Brand, MobileNavDrawer } from '@/widgets/navbar'
import { ThemeToggle } from '@/widgets/theme-toggle'

const icons: Record<NavIconKey, typeof Home> = {
  dashboard: PanelsTopLeft,
  home: Home,
  uiKit: Sparkles,
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-800 dark:text-zinc-50'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
  )

function MarketingNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation()

  return (
    <>
      {MARKETING_NAV_ITEMS.map((item) => {
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

export function MarketingLayout() {
  const { t } = useTranslation()
  const drawer = useDisclosure()
  const { pathname } = useLocation()
  const showAuthCta = LAYOUT !== 'marketing'

  useEffect(() => {
    drawer.close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <Container className="flex min-h-16 items-center justify-between gap-3 sm:gap-4">
          <Brand to={ROUTES.home} />

          <nav className="hidden items-center gap-1 md:flex" aria-label={t('nav.main')}>
            <MarketingNavLinks />
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
            {showAuthCta ? (
              <Link to={ROUTES.login} className={buttonVariants({ size: 'sm' })}>
                <LogIn className="size-4" aria-hidden="true" />
                {t('common.signIn')}
              </Link>
            ) : null}
          </div>

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
            <nav className="grid gap-1" aria-label={t('nav.main')}>
              <MarketingNavLinks onNavigate={drawer.close} />
            </nav>

            <div className="grid gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="flex items-center justify-between gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              {showAuthCta ? (
                <Link
                  to={ROUTES.login}
                  className={buttonVariants({ size: 'md', className: 'w-full' })}
                  onClick={drawer.close}
                >
                  <LogIn className="size-4" aria-hidden="true" />
                  {t('common.signIn')}
                </Link>
              ) : null}
            </div>
          </MobileNavDrawer>
        </Container>
      </header>

      <Container as="main" className="flex-1 py-6 sm:py-8 lg:py-10">
        <Outlet />
      </Container>

      <footer className="border-t border-zinc-200 bg-white py-6 dark:border-zinc-800 dark:bg-zinc-950">
        <Container className="flex flex-col gap-3 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-zinc-400">
          <p>{t('layout.footerTagline')}</p>
          <Link
            to={ROUTES.uiKit}
            className="inline-flex min-h-11 items-center rounded-md text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {t('layout.viewUiKit')}
          </Link>
        </Container>
      </footer>
    </div>
  )
}

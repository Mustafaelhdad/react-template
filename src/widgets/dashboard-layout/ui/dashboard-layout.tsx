import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { useDisclosure } from '@/shared/lib'
import { Button } from '@/shared/ui'
import { AppSidebar } from '@/widgets/app-sidebar'
import { Breadcrumbs } from '@/widgets/breadcrumbs'

/**
 * Two-pane dashboard:
 *
 *   - ≥ `md` (768px): the sidebar is rendered inline on the left.
 *   - `< md`: the sidebar collapses into a side sheet (Radix Dialog
 *     repositioned to slide in from the start side). A trigger button
 *     in the topbar opens it; navigating closes it.
 */
export function DashboardLayout() {
  const { t } = useTranslation()
  const drawer = useDisclosure()
  const { pathname } = useLocation()

  // Close the drawer on any route change so the user doesn't have to
  // tap twice to navigate on mobile.
  useEffect(() => {
    drawer.close()
    // The disclosure object is stable; we only care about pathname.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 md:hidden">
        <DialogPrimitive.Root open={drawer.isOpen} onOpenChange={drawer.toggle}>
          <DialogPrimitive.Trigger asChild>
            <Button variant="secondary" size="sm" aria-label={t('layout.openMenu')}>
              <Menu className="size-4" aria-hidden="true" />
              {t('layout.navigation')}
            </Button>
          </DialogPrimitive.Trigger>
          <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/70" />
            <DialogPrimitive.Content className="fixed inset-y-0 start-0 z-50 grid h-full w-[18rem] max-w-[85vw] grid-rows-[auto_1fr] gap-4 border-zinc-200 bg-white p-4 shadow-xl border-e data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-right dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <DialogPrimitive.Title className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                  {t('layout.navigation')}
                </DialogPrimitive.Title>
                <DialogPrimitive.Close asChild>
                  <Button variant="ghost" size="icon" aria-label={t('layout.closeMenu')}>
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </DialogPrimitive.Close>
              </div>
              <AppSidebar />
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
        <Breadcrumbs />
      </div>

      <div className="hidden md:block">
        <Breadcrumbs />
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <Outlet />
      </div>
    </div>
  )
}

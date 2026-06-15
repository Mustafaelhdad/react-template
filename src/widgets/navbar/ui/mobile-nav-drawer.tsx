import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib'
import { Button } from '@/shared/ui'

type MobileNavDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Side the sheet slides in from. `start`/`end` stay correct under RTL. */
  side: 'start' | 'end'
  /** Accessible title rendered in the sheet header. */
  title: string
  /** Element that opens the sheet; rendered through Radix `asChild`. */
  trigger: ReactNode
  /** Extra classes for the sheet panel — typically width and grid rows. */
  contentClassName?: string
  children: ReactNode
}

const sideClasses = {
  end: 'end-0 border-s data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rtl:data-[state=closed]:slide-out-to-left rtl:data-[state=open]:slide-in-from-left',
  start:
    'start-0 border-e data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-right',
} as const

/**
 * Off-canvas navigation sheet shared by every header preset. Owns the Radix
 * dialog scaffold (overlay, panel, close button) so each layout only supplies
 * its trigger and the nav content.
 */
export function MobileNavDrawer({
  open,
  onOpenChange,
  side,
  title,
  trigger,
  contentClassName,
  children,
}: MobileNavDrawerProps) {
  const { t } = useTranslation()

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/70" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            'fixed inset-y-0 z-50 grid h-full max-w-[85vw] gap-4 border-zinc-200 bg-white p-4 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out dark:border-zinc-800 dark:bg-zinc-900',
            sideClasses[side],
            contentClassName,
          )}
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label={t('layout.closeMenu')}>
                <X className="size-5" aria-hidden="true" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

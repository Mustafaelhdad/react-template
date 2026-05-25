import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

export function DialogOverlay({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 dark:bg-black/70',
        className,
      )}
      {...props}
    />
  )
}

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  hideCloseButton?: boolean
}

export function DialogContent({
  className,
  children,
  hideCloseButton,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out sm:p-6 dark:border-zinc-800 dark:bg-zinc-900',
          className,
        )}
        {...props}
      >
        {children}
        {hideCloseButton ? null : (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-sm text-zinc-500 transition-colors hover:text-zinc-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 sm:right-3 sm:top-3 dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus-visible:outline-zinc-50"
          >
            <X className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

export function DialogTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-zinc-950 dark:text-zinc-50',
        className,
      )}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-sm text-zinc-500 dark:text-zinc-400', className)}
      {...props}
    />
  )
}

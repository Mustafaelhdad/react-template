import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

/**
 * Light table primitives. Compose these directly for simple tables.
 *
 * For sorting, filtering, virtualization, column visibility, etc., install
 * `@tanstack/react-table` and use these primitives as the styled body of
 * its headless API.
 */

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead
      className={cn(
        '[&_tr]:border-b [&_tr]:border-zinc-200 dark:[&_tr]:border-zinc-800',
        className,
      )}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot
      className={cn(
        'border-t border-zinc-200 bg-zinc-50 font-medium [&>tr]:last:border-b-0 dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return (
    <tr
      className={cn(
        'border-b border-zinc-200 transition-colors hover:bg-zinc-50 data-[state=selected]:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-800/50 dark:data-[state=selected]:bg-zinc-800',
        className,
      )}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return (
    <th
      className={cn(
        'h-10 px-3 text-left align-middle text-xs font-medium uppercase tracking-wide text-zinc-500 [&:has([role=checkbox])]:pr-0 dark:text-zinc-400',
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return (
    <td
      className={cn(
        'px-3 py-2 align-middle text-zinc-800 [&:has([role=checkbox])]:pr-0 dark:text-zinc-200',
        className,
      )}
      {...props}
    />
  )
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      className={cn('mt-4 text-sm text-zinc-500 dark:text-zinc-400', className)}
      {...props}
    />
  )
}

import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

type SelectProps = ComponentProps<'select'>

/**
 * Native <select>. Good enough for most forms.
 *
 * If you need a fully custom dropdown with search, virtualization, or
 * multi-select, swap this for `@radix-ui/react-select` (or a combobox).
 */
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'flex min-h-11 w-full cursor-pointer appearance-none rounded-md border border-zinc-300 bg-white bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat px-3 py-2 pr-8 text-sm text-zinc-950 shadow-sm transition-colors focus:border-zinc-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-200 dark:disabled:bg-zinc-800',
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  )
}

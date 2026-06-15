import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

type InputProps = ComponentProps<'input'>

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'flex min-h-11 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-start text-sm text-zinc-950 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-200 dark:disabled:bg-zinc-800',
        className,
      )}
      {...props}
    />
  )
}

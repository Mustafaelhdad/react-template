import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        'peer size-5 shrink-0 cursor-pointer rounded border border-zinc-300 bg-white text-zinc-950 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 checked:border-zinc-950 checked:bg-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:focus-visible:outline-zinc-50 dark:checked:border-zinc-50 dark:checked:bg-zinc-50',
        className,
      )}
      {...props}
    />
  )
}

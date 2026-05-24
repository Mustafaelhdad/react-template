import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

type LabelProps = ComponentProps<'label'>

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none text-zinc-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-zinc-100',
        className,
      )}
      {...props}
    />
  )
}

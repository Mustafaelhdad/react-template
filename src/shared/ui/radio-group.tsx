import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/shared/lib'

type RadioGroupProps = Omit<ComponentProps<'div'>, 'role'> & {
  name?: string
  children?: ReactNode
}

export function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <div role="radiogroup" className={cn('grid gap-2', className)} {...props} />
}

type RadioGroupItemProps = Omit<ComponentProps<'input'>, 'type'>

export function RadioGroupItem({ className, ...props }: RadioGroupItemProps) {
  return (
    <input
      type="radio"
      className={cn(
        'peer size-4 shrink-0 cursor-pointer rounded-full border border-zinc-300 bg-white text-zinc-950 shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 checked:border-zinc-950 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

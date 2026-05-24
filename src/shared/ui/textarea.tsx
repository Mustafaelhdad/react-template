import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

type TextareaProps = ComponentProps<'textarea'>

export function Textarea({ className, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'flex w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}

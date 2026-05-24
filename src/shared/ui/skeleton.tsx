import type { ComponentProps } from 'react'

import { cn } from '@/shared/lib'

type SkeletonProps = ComponentProps<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-testid="skeleton"
      className={cn('animate-pulse rounded-md bg-zinc-200', className)}
      {...props}
    />
  )
}

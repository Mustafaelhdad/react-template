import type { ComponentProps, ElementType } from 'react'

import { cn } from '@/shared/lib'

type ContainerProps<T extends ElementType = 'div'> = {
  as?: T
} & ComponentProps<T>

export function Container<T extends ElementType = 'div'>({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component = (as ?? 'div') as ElementType
  return (
    <Component
      className={cn('mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  )
}

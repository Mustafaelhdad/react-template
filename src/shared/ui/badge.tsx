import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib'

import { badgeVariants } from './badge-variants'

type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

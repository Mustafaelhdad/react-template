import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/shared/lib'

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-5',
      lg: 'size-6',
      xl: 'size-8',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

type SpinnerProps = Omit<ComponentProps<'svg'>, 'children'> &
  VariantProps<typeof spinnerVariants> & {
    label?: string
  }

export function Spinner({ className, size, label = 'Loading', ...props }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn(
        spinnerVariants({ size }),
        'text-zinc-700 dark:text-zinc-300',
        className,
      )}
      {...props}
    />
  )
}
